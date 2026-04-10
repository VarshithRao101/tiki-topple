"use client";

import { useState, useCallback, useEffect } from "react";
import type { GameState, Token, Player, Card } from "@/lib/game-types";
import { TOKEN_COLORS, SCORING_TABLE } from "@/lib/game-types";
import { socket } from "@/lib/socket";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createPlayerDeck(playerId: string): Card[] {
  const cards: Card[] = [
    { id: `${playerId}-up1-1`, type: 'tiki-up', value: 1 },
    { id: `${playerId}-up1-2`, type: 'tiki-up', value: 1 },
    { id: `${playerId}-up2`, type: 'tiki-up', value: 2 },
    { id: `${playerId}-up3`, type: 'tiki-up', value: 3 },
    { id: `${playerId}-topple`, type: 'tiki-topple' },
    { id: `${playerId}-toast-1`, type: 'tiki-toast' },
    { id: `${playerId}-toast-2`, type: 'tiki-toast' },
  ];
  return shuffleArray(cards);
}

function createInitialState(
  numPlayers: number, 
  config?: { playerName: string; playerColor: string; mode: 'bot' | 'online'; roomCode?: string }
): GameState {
  const allTokens: Token[] = TOKEN_COLORS.map((tc, i) => ({
    id: `token-${i}`,
    color: tc.color,
    name: tc.name,
  }));

  const stack = shuffleArray(allTokens);
  const secretTikiAssignments = assignSecretTikis(numPlayers);
  
  const players: Player[] = [];
  const hands: Card[][] = [];

  for (let i = 0; i < numPlayers; i++) {
    const isHuman = i === 0;
    players.push({
      id: i,
      name: isHuman && config ? config.playerName : `Bot ${i}`,
      color: isHuman && config ? config.playerColor : TOKEN_COLORS[i+3].color,
      score: 0,
      secretTikis: secretTikiAssignments[i] || [],
    });
    hands.push(createPlayerDeck(`p${i}`));
  }

  return {
    stack,
    players,
    currentPlayerIndex: 0,
    turn: 1,
    gamePhase: config ? "playing" : "setup",
    winner: null,
    selectedTokenIndex: null,
    selectedCard: null,
    playerHands: hands,
    mode: config?.mode || 'bot',
    roomCode: config?.roomCode,
    currentRound: 1,
    totalRounds: numPlayers,
  };
}

function assignSecretTikis(numPlayers: number): string[][] {
  const allTikiIds = TOKEN_COLORS.map((_, i) => `token-${i}`);
  const shuffledTikis = shuffleArray(allTikiIds);
  const tikisPerPlayer = Math.floor(9 / numPlayers);
  
  const assignments: string[][] = [];
  for (let i = 0; i < numPlayers; i++) {
    const start = i * tikisPerPlayer;
    const end = start + tikisPerPlayer;
    assignments.push(shuffledTikis.slice(start, end));
  }
  return assignments;
}

export function useGame(initialPlayers: number = 2) {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(initialPlayers)
  );

  useEffect(() => {
    socket.on("game-start", (state) => {
      setGameState(state);
    });

    socket.on("game-update", (state) => {
      setGameState(state);
    });

    return () => {
      socket.off("game-start");
      socket.off("game-update");
    };
  }, []);

  const startGame = useCallback((newConfig: any) => {
    setGameConfig(newConfig);
    if (newConfig.mode === 'online') {
      socket.connect();
      if (newConfig.isCreating) {
        socket.emit("create-room", { ...newConfig });
      } else {
        socket.emit("join-room", { ...newConfig, roomId: newConfig.roomCode });
      }
    } else {
      setGameState(createInitialState(newConfig.numPlayers || 2, newConfig));
    }
  }, []);

  const resetGame = useCallback((numPlayers: number) => {
    setGameState(createInitialState(numPlayers));
  }, []);

  const selectToken = useCallback((index: number) => {
    setGameState((prev) => {
      if (prev.gamePhase !== "playing") return prev;
      
      // If a card is already selected, this click executes the move
      if (prev.selectedCard) {
        // We will trigger executeAction outside of setGameState to avoid side-effects
        // But we need to update the state with the selected token first
        return { ...prev, selectedTokenIndex: index };
      }

      if (prev.selectedTokenIndex === index) {
        return { ...prev, selectedTokenIndex: null };
      }
      return { ...prev, selectedTokenIndex: index };
    });
  }, []);

  const selectCard = useCallback((card: Card) => {
    setGameState((prev) => {
      if (prev.gamePhase !== "playing") return prev;
      if (prev.selectedCard?.id === card.id) {
        return { ...prev, selectedCard: null, selectedTokenIndex: null };
      }
      // Reset token selection when changing cards
      return { ...prev, selectedCard: card, selectedTokenIndex: null };
    });
  }, []);

  // Effect to trigger execution when both are selected
  useEffect(() => {
    if (gameState.selectedCard && gameState.selectedTokenIndex !== null && gameState.gamePhase === 'playing') {
      executeAction();
    }
  }, [gameState.selectedCard, gameState.selectedTokenIndex, gameState.gamePhase]);
  const executeAction = useCallback(() => {
    if (!gameState.selectedCard || gameState.gamePhase !== "playing" || gameState.selectedTokenIndex === null) return;

    if (gameState.mode === 'online') {
      socket.emit("player-move", {
        roomId: gameState.roomCode,
        move: { card: gameState.selectedCard, tokenIndex: gameState.selectedTokenIndex }
      });
      return;
    }

    // Offline / Bot logic
    setGameState((prev) => {
      const playerIndex = prev.currentPlayerIndex;
      const { selectedCard, selectedTokenIndex, stack, playerHands } = prev;
      
      let newStack = [...stack];
      const card = selectedCard!;

      if (card.type === 'tiki-up') {
        const moveAmount = Math.min(card.value || 1, selectedTokenIndex!);
        if (moveAmount > 0) {
          const [token] = newStack.splice(selectedTokenIndex!, 1);
          newStack.splice(selectedTokenIndex! - moveAmount, 0, token);
        }
      } else if (card.type === 'tiki-topple') {
        const [token] = newStack.splice(selectedTokenIndex!, 1);
        newStack.push(token);
      } else if (card.type === 'tiki-toast') {
        const toastIdx = selectedTokenIndex !== null ? selectedTokenIndex : newStack.length - 1;
        newStack.splice(toastIdx, 1);
      }

      const newHands = [...playerHands];
      newHands[playerIndex] = newHands[playerIndex].filter(c => c.id !== card.id);

      const nextPhase = (newStack.length <= 3 || newHands.every(h => h.length === 0))
        ? (prev.currentRound >= prev.totalRounds ? 'ended' : 'roundEnded')
        : 'playing';

      let updatedPlayers = [...prev.players];
      if (nextPhase !== 'playing') {
        updatedPlayers = prev.players.map(p => {
          let roundScore = 0;
          p.secretTikis.forEach(tikiId => {
            const pos = newStack.findIndex(t => t.id === tikiId);
            if (pos !== -1 && pos < 3) {
              const points = [9, 5, 2];
              roundScore += points[pos];
            }
          });
          return { ...p, score: p.score + roundScore };
        });
      }

      let winner = null;
      if (nextPhase === 'ended') {
        winner = [...updatedPlayers].sort((a, b) => b.score - a.score)[0];
      }

      return {
        ...prev,
        stack: newStack,
        playerHands: newHands,
        players: updatedPlayers,
        gamePhase: nextPhase,
        winner,
        currentPlayerIndex: nextPhase === 'playing' ? (prev.currentPlayerIndex + 1) % prev.players.length : prev.currentPlayerIndex,
        selectedCard: null,
        selectedTokenIndex: null,
        turn: prev.turn + 1,
      };
    });
  }, [gameState.selectedCard, gameState.selectedTokenIndex, gameState.gamePhase, gameState.mode, gameState.roomCode]);

  const nextRound = useCallback(() => {
    if (gameState.mode === 'online') {
      socket.emit("start-next-round", { roomId: gameState.roomCode });
    } else {
      setGameState(prev => {
        const nextState = createInitialState(prev.players.length, { ...config!, mode: 'bot' });
        return {
          ...nextState,
          players: nextState.players.map((p, i) => ({ ...p, score: prev.players[i].score })),
          currentRound: prev.currentRound + 1,
          totalRounds: prev.totalRounds,
          currentPlayerIndex: (prev.currentRound) % prev.players.length
        };
      });
    }
  }, [gameState.mode, gameState.roomCode, gameState.currentRound, gameState.players.length, config]);

  // Bot Turn Effect
  useEffect(() => {
    if (gameState.mode === 'bot' && gameState.gamePhase === 'playing' && gameState.currentPlayerIndex !== 0) {
      const timer = setTimeout(() => {
        const currentHand = gameState.playerHands[gameState.currentPlayerIndex];
        if (currentHand.length === 0) return;

        const randomCard = currentHand[Math.floor(Math.random() * currentHand.length)];
        const possibleTokenIndices = Array.from({ length: gameState.stack.length }, (_, i) => i);
        // If toast, bot picks from the bottom 3 (if exists) or just the bottom one
        const randomTokenIndex = randomCard.type === 'tiki-toast' 
          ? (gameState.stack.length - 1) 
          : possibleTokenIndices[Math.floor(Math.random() * possibleTokenIndices.length)];

        setGameState(prev => ({
          ...prev,
          selectedCard: randomCard,
          selectedTokenIndex: randomTokenIndex
        }));

        setTimeout(executeAction, 1000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.mode, gameState.gamePhase, gameState.currentPlayerIndex, gameState.playerHands, gameState.stack.length, executeAction]);

  const canExecute = gameState.selectedCard !== null && 
                    (gameState.selectedCard.type === 'tiki-toast' || gameState.selectedTokenIndex !== null);

  return {
    gameState,
    startGame,
    resetGame,
    selectToken,
    selectCard,
    executeAction,
    nextRound,
    canExecute,
  };
}

function calculateFinalScores(state: GameState): GameState {
  const updatedPlayers = state.players.map((player) => {
    let totalScore = 0;
    player.secretTikis.forEach((tokenId) => {
      const stackPosition = state.stack.findIndex((t) => t.id === tokenId);
      if (stackPosition >= 0) {
        const rank = stackPosition + 1;
        totalScore += SCORING_TABLE[rank] || 0;
      }
    });
    return { ...player, score: totalScore };
  });

  const sortedPlayers = [...updatedPlayers].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return {
    ...state,
    players: updatedPlayers,
    gamePhase: "ended",
    winner,
  };
}
