"use client";

import { useState, useCallback } from "react";
import type { GameState, Token, Player, Card } from "@/lib/game-types";
import { TOKEN_COLORS, SCORING_TABLE } from "@/lib/game-types";

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
  };
}

function assignSecretTikis(numPlayers: number): string[][] {
  const allTikiIds = TOKEN_COLORS.map((_, i) => `token-${i}`);
  const shuffledTikis = shuffleArray(allTikiIds);
  const tikisPerPlayer = 3; // Standard rules: each player gets 3 target Tikis
  
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

  const setFullState = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const startGame = useCallback((numPlayers: number, config: any) => {
    setGameState(createInitialState(numPlayers, config));
  }, []);

  const resetGame = useCallback((numPlayers: number) => {
    setGameState(createInitialState(numPlayers));
  }, []);

  const selectToken = useCallback((index: number) => {
    setGameState((prev) => {
      if (prev.gamePhase !== "playing") return prev;
      
      // If we are selecting a token for Tiki Toast, confirm it MUST be the bottom one if that's the rule
      // But we'll allow any selection for flexibility, but Tiki Toast usually auto-targets bottom.
      // USER REQUEST: Make sure cards are NOT used without selecting coins.
      // So even Tiki Toast will now require clicking the bottom token to "confirm".

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
      return { ...prev, selectedCard: card, selectedTokenIndex: null };
    });
  }, []);

  const executeAction = useCallback(() => {
    setGameState((prev) => {
      if (prev.gamePhase !== "playing") return prev;
      if (!prev.selectedCard) return prev;
      
      const card = prev.selectedCard;
      const tokenIndex = prev.selectedTokenIndex;
      
      // NEW STRICT RULE: ALL cards must have a token selection to execute
      // This prevents accidental consumption of cards.
      if (tokenIndex === null) return prev;

      let newStack = [...prev.stack];

      if (card.type === 'tiki-up' && tokenIndex !== null) {
        const moveAmount = Math.min(card.value || 1, tokenIndex);
        if (moveAmount > 0) {
          const [token] = newStack.splice(tokenIndex, 1);
          newStack.splice(tokenIndex - moveAmount, 0, token);
        }
      } else if (card.type === 'tiki-topple' && tokenIndex !== null) {
        const [token] = newStack.splice(tokenIndex, 1);
        newStack.push(token);
      } else if (card.type === 'tiki-toast' && tokenIndex !== null) {
        // Remove the selected token (vanish)
        newStack.splice(tokenIndex, 1);
      }

      const newHands = [...prev.playerHands];
      newHands[prev.currentPlayerIndex] = newHands[prev.currentPlayerIndex].filter(
        (c) => c.id !== card.id
      );

      const totalCardsRemaining = newHands.reduce((sum, hand) => sum + hand.length, 0);
      const gameEnded = newStack.length <= 3 || totalCardsRemaining === 0;

      const nextPlayerIndex = gameEnded
        ? prev.currentPlayerIndex
        : (prev.currentPlayerIndex + 1) % prev.players.length;

      let newState: GameState = {
        ...prev,
        stack: newStack,
        turn: prev.turn + 1,
        currentPlayerIndex: nextPlayerIndex,
        selectedTokenIndex: null,
        selectedCard: null,
        playerHands: newHands,
      };

      if (gameEnded) {
        newState = calculateFinalScores(newState);
      }

      return newState;
    });
  }, []);

  const canExecute = gameState.selectedCard !== null && gameState.selectedTokenIndex !== null;

  return {
    gameState,
    startGame,
    resetGame,
    selectToken,
    selectCard,
    executeAction,
    canExecute,
    setFullState
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
