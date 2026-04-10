"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "@/hooks/use-game";
import { TikiStack } from "./tiki-stack";
import { TikiToken } from "./tiki-token";
import { ActionCard } from "./action-card";
import { GameSetup, GameConfig } from "./game-setup";
import { Button } from "@/components/ui/button";
import { RotateCcw, HelpCircle, X, Shield, Trophy, Users, User, Bot as BotIcon, Crown, Sparkles } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { TIKI_MASKS } from "@/lib/tiki-masks";
import { TOKEN_COLORS } from "@/lib/game-types";
import { TikiFace } from "./tiki-face";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function TikiToppleGame() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [animatingAction, setAnimatingAction] = useState<{ type: string, index: number } | null>(null);
  
  // Cinematic Intro State
  const [introStep, setIntroStep] = useState<'none' | 'countdown' | 'cards' | 'special'>('none');
  const [introCount, setIntroCount] = useState(3);
  
  const socketRef = useRef<Socket | null>(null);
  
  const {
    gameState,
    startGame,
    selectToken,
    selectCard,
    executeAction,
    setFullState
  } = useGame();

  // Socket setup
  useEffect(() => {
    if (config?.mode === 'online') {
      socketRef.current = io(SOCKET_URL);

      socketRef.current.on('connect', () => {
        if (config.action === 'create') {
          socketRef.current?.emit('create-room', {
            roomId: config.roomCode,
            password: config.roomPassword,
            maxPlayers: config.playerCount,
            playerName: config.playerName,
            playerColor: config.playerColor
          });
        } else {
          socketRef.current?.emit('join-room', {
            roomId: config.roomCode,
            password: config.roomPassword,
            playerName: config.playerName,
            playerColor: config.playerColor
          });
        }
      });

      socketRef.current.on('room-joined', (room) => {
        console.log("Joined room:", room);
      });

      socketRef.current.on('game-ready', () => {
        setIsReady(true);
      });

      socketRef.current.on('game-started', (room) => {
        startGame(room.maxPlayers, {
          playerName: config.playerName,
          playerColor: config.playerColor,
          mode: 'online',
          roomCode: config.roomCode
        });
        setIntroStep('countdown');
        setIntroCount(3);
      });

      socketRef.current.on('opponent-move', (remoteState) => {
         setFullState(remoteState);
      });

      socketRef.current.on('error', (msg) => {
        alert(msg);
        setConfig(null);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [config, startGame, setFullState]);

  const handleStart = (newConfig: GameConfig) => {
    setConfig(newConfig);
    if (newConfig.mode === 'bot') {
      startGame(newConfig.playerCount, newConfig);
      setIntroStep('countdown');
      setIntroCount(3);
    }
  };

  // Cinematic Sequence Timers
  useEffect(() => {
    if (introStep === 'countdown') {
      if (introCount > 0) {
        const timer = setTimeout(() => setIntroCount(introCount - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIntroStep('cards');
      }
    } else if (introStep === 'cards') {
      const timer = setTimeout(() => setIntroStep('special'), 2000);
      return () => clearTimeout(timer);
    } else if (introStep === 'special') {
      const timer = setTimeout(() => setIntroStep('none'), 3500);
      return () => clearTimeout(timer);
    }
  }, [introStep, introCount]);

  const handleStartOnline = () => {
    socketRef.current?.emit('start-game', config?.roomCode);
  };

  // Bot logic (Handles up to 3 bots)
  useEffect(() => {
    if (introStep !== 'none') return; // Pause bots during cinematic intro!
    
    if (gameState.gamePhase === "playing" && gameState.mode === 'bot' && gameState.currentPlayerIndex !== 0) {
      const timer = setTimeout(() => {
        const botHand = gameState.playerHands[gameState.currentPlayerIndex];
        if (botHand && botHand.length > 0) {
          const randomCard = botHand[Math.floor(Math.random() * botHand.length)];
          selectCard(randomCard);
          
          // Bots need time to "think" between picking card and token
          setTimeout(() => {
            let targetIndex;
            if (randomCard.type === 'tiki-toast') {
              targetIndex = gameState.stack.length - 1; // Always target bottom for bot simplicity
            } else {
              targetIndex = Math.floor(Math.random() * gameState.stack.length);
            }
            selectToken(targetIndex);
            
            // Execute after token selection
            setTimeout(executeAction, 800);
          }, 1000);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.gamePhase, gameState.mode, gameState.playerHands, gameState.stack.length, selectCard, selectToken, executeAction]);

  // Sync human moves to server
  useEffect(() => {
    if (config?.mode === 'online' && gameState.gamePhase === 'playing') {
       // Only host or logic? Usually broadcast every change if it's the current player's turn
       // But to avoid loops, we emit 'move' on executeAction or selectCard?
       // Let's emit full state after executeAction in useGame if possible, or here.
    }
  }, [gameState]);

  // Handle execution trigger (now only happens if both are selected)
  useEffect(() => {
    if (gameState.gamePhase !== "playing") return;
    
    if (gameState.selectedCard && gameState.selectedTokenIndex !== null) {
      // Trigger animation instantly
      setAnimatingAction({ type: gameState.selectedCard.type, index: gameState.selectedTokenIndex });

      // Delay for visual feedback before execution allowing CSS to trigger
      const timer = setTimeout(() => {
        executeAction();
        setAnimatingAction(null);
        // If online, broadcast the new state
        if (config?.mode === 'online') {
            // We need the NEW state, but useEffect gives current. 
            // In a real app, useGame would emit or we use a separate callback.
            // For now, we'll emit the current state which is the "after action" state
            // because this effect runs after the state update.
            socketRef.current?.emit('player-move', {
                roomId: config.roomCode,
                gameState: gameState 
            });
        }
      }, 750);
      return () => {
         clearTimeout(timer);
         setAnimatingAction(null);
      };
    }
  }, [gameState.selectedCard, gameState.selectedTokenIndex, executeAction, config, gameState]);

  if (gameState.gamePhase === "setup" || !config) {
    return <GameSetup onStart={handleStart} />;
  }

  // Lobby view for online game
  if (config.mode === 'online' && !isReady && gameState.gamePhase !== 'playing') {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] text-center">
                <Users size={48} className="mx-auto text-blue-500 mb-6" />
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">Waiting for crew...</h2>
                <p className="text-zinc-500 text-xs font-bold mb-8 uppercase tracking-widest leading-relaxed">Room Code: <span className="text-white">{config.roomCode}</span></p>
                <div className="space-y-2 mb-8">
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                        <span className="text-sm font-black text-white">{config.playerName}</span>
                        <span className="text-[8px] font-black uppercase text-zinc-600">You (Host)</span>
                    </div>
                </div>
                <div className="text-xs text-zinc-700 animate-pulse font-black uppercase">Syncing totem data...</div>
            </div>
        </div>
      );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isHumanTurn = gameState.currentPlayerIndex === 0;
  const humanHand = gameState.playerHands[0] || [];
  const opponents = gameState.players.slice(1);

  return (
    <div className="min-h-screen bg-[url('/aefd765b7818675865c07e4260982ba7.jpg')] bg-cover bg-fixed bg-center text-white flex flex-col font-sans selection:bg-green-500 selection:text-white overflow-hidden relative">
      {/* Dynamic Jungle Vignette & Flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,10,0,0.9)_100%)] pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-green-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="h-24 flex items-center justify-between px-10 relative z-20 pt-6">
        <div className="flex items-center gap-6 bg-black/40 backdrop-blur-2xl border-t border-l border-white/10 border-b border-black/50 px-8 py-3 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <h1 className="text-3xl font-black tracking-tighter italic bg-gradient-to-br from-[#E2F0CB] via-[#A2E4B8] to-[#16a34a] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">TIKI TOPPLE</h1>
          <div className="flex items-center gap-2 bg-black/50 border border-white/5 shadow-inner rounded-xl px-4 py-1.5 text-[10px] font-black uppercase text-green-300/80">
            <Shield size={12} className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
            {config.mode === 'online' ? `ROOM: ${config.roomCode}` : 'LOC BOT MODE'}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl border-t border-l border-white/10 border-b border-black/50 px-4 py-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <Button variant="ghost" size="icon" onClick={() => setShowRules(true)} className="hover:bg-white/10 text-green-200/60 hover:text-green-200 rounded-xl transition-all">
            <HelpCircle size={20} />
          </Button>
          <div className="w-px h-6 bg-white/10" />
          <Button variant="ghost" size="icon" onClick={() => window.location.reload()} className="hover:bg-white/10 text-green-200/60 hover:text-green-200 rounded-xl transition-all">
            <RotateCcw size={20} />
          </Button>
        </div>
      </header>

      {/* Main Game Layout */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left/Main Area: Opponents Top and Board Middle-Left */}
        <div className="flex-1 relative flex flex-col bg-transparent overflow-hidden">
          
          {/* Opponent Cards (Top) - Converted to floating glass pills */}
          <div className="h-[120px] flex items-end justify-center gap-8 px-8 pb-4">
            {opponents.map((opp, idx) => (
                <div key={opp.id} className={`flex flex-col items-center gap-3 px-6 py-4 bg-black/40 backdrop-blur-2xl border-t border-white/10 border-b border-black/60 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-500 ${gameState.currentPlayerIndex === idx + 1 ? 'scale-110 opacity-100 ring-2 ring-green-400/30 ring-offset-4 ring-offset-transparent shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'opacity-40 scale-95 grayscale-[30%]'}`}>
                    <div className="flex gap-1">
                        {Array.from({ length: gameState.playerHands[idx + 1].length }).map((_, i) => (
                            <div key={i} className="w-5 h-7 bg-gradient-to-br from-amber-700/80 to-amber-950/80 border border-white/20 border-b-black/80 rounded shadow-md" />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/5 shadow-inner">
                         <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: opp.color, color: opp.color }} />
                         <span className="text-[10px] font-black uppercase text-green-100/70 tracking-widest">{opp.name}</span>
                    </div>
                </div>
            ))}
          </div>

          {/* Board Area (Centered Left) */}
          <div className="flex-1 relative flex items-center justify-center pr-[15%]">
            <div className="relative h-screen aspect-[9/18] flex items-center justify-center bg-transparent overflow-hidden py-10 scale-[1.1] translate-y-[-5%]">
              <img src="/board.png" alt="Board" className="absolute inset-0 w-full h-full object-fill brightness-110 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
              
              <div className="relative z-10 w-full h-full">
                <TikiStack
                  tokens={gameState.stack}
                  selectedIndex={gameState.selectedTokenIndex}
                  onSelectToken={selectToken}
                  disabled={!isHumanTurn || gameState.gamePhase !== "playing" || !gameState.selectedCard}
                  animatingAction={animatingAction}
                />
              </div>
            </div>

            {/* Turn Indicator Overlay */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
              <div className={`px-6 py-2 rounded-full border border-green-500/20 backdrop-blur-3xl shadow-2xl transition-all ${isHumanTurn ? 'bg-green-600/20 border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-black/60 shadow-none'}`}>
                <span className={`text-xs font-black uppercase tracking-[0.2em] ${isHumanTurn ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'text-green-200/50'}`}>
                  {isHumanTurn ? "Your Power move" : `${currentPlayer.name} Thinking...`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Controls & Objectives */}
        <div className="w-[430px] h-full py-6 pr-6 relative z-30 flex">
          <aside className="w-full h-full flex flex-col p-5 bg-black/30 backdrop-blur-3xl border-t border-l border-white/10 border-b border-black/80 rounded-[2.5rem] shadow-[-40px_0_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-y-auto">
            {/* Your Identity */}
            <div className="flex items-center gap-3 p-4 rounded-[1.5rem] bg-black/50 border border-white/5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.4)] mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-950 text-2xl font-black shadow-[inset_0_2px_10px_rgba(255,255,255,0.4),0_5px_15px_rgba(0,0,0,0.5)] border border-white/20" style={{ backgroundColor: config.playerColor }}>
                 {config.playerName[0].toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300/50 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">Competitor</div>
                <div className="text-2xl font-black text-white tracking-tight truncate">{config.playerName}</div>
              </div>
              <div className="text-right bg-white/5 p-2 rounded-lg border border-white/5 shadow-inner">
                  <div className="text-[9px] font-black uppercase text-green-300/50 tracking-widest mb-0.5">Points</div>
                  <div className="font-black text-3xl leading-none bg-gradient-to-b from-[#E2F0CB] to-[#26A65B] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">{gameState.players[0].score}</div>
              </div>
            </div>

          {/* Your Hand */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between px-2">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-green-300/60 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">Personal Hand</div>
              {gameState.selectedCard && (
                <div className="text-[9px] font-black uppercase text-green-400 animate-pulse px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">Staged</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2.5 p-3 bg-black/40 rounded-2xl border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_5px_20px_rgba(0,0,0,0.6)]">
              {humanHand.map((card) => (
                <ActionCard
                  key={card.id}
                  card={card}
                  isSelected={gameState.selectedCard?.id === card.id}
                  onClick={() => selectCard(card)}
                  disabled={!isHumanTurn || gameState.gamePhase !== "playing"}
                  playerColor={config.playerColor}
                />
              ))}
            </div>
            
            {!gameState.selectedCard && isHumanTurn && (
              <div className="text-center py-2 text-green-300/40 text-[10px] font-black uppercase tracking-[0.3em]">
                Target a ritual card
              </div>
            )}
            
            {gameState.selectedCard && isHumanTurn && (
              <div className="text-center py-2 text-green-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                Touch totem piece to execute
              </div>
            )}
          </div>

          {/* Secret Objectives */}
          <div className="mt-auto space-y-3">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-green-300/60 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)] px-2">Spirit Guides</div>
            <div className="relative w-full aspect-[2/3] bg-white rounded-[2.5rem] p-3 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-2 border-4 border-zinc-200">
              {gameState.players[0].secretTikis.map((tokenId, i) => {
                  const token = gameState.stack.find(t => t.id === tokenId);
                  const isToasted = !token;
                  
                  // If toasted, we still want to show which token it was, but we need its data.
                  // Since the stack no longer has it, we look it up from the master TIKI_MASKS or similar.
                  // For now, let's find it in the initial token identification logic
                  const masterToken = TOKEN_COLORS.find((_, index) => `token-${index}` === tokenId);
                  const color = token?.color || masterToken?.color || '#333';
                  const name = token?.name || masterToken?.name || 'Eliminated';
                  
                  const labels = ["1ST ONLY = 9PTS", "2ND = 5PTS", "3RD = 2PTS"];
                  return (
                    <div key={tokenId} className={`flex-1 w-full rounded-2xl p-2 flex items-center shadow-lg overflow-hidden relative border-b-4 transition-transform hover:scale-[1.02] ${isToasted ? 'opacity-40 grayscale' : ''}`} style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.3)' }}>
                        {/* 3D Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply" style={{ 
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 2px, transparent 2px, transparent 4px)',
                        }} />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl" />
                        
                        {isToasted && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                <span className="text-white/20 font-black text-4xl rotate-12 uppercase tracking-tight">TOASTED</span>
                            </div>
                        )}

                        <div className="relative z-10 w-16 h-full flex items-center justify-center p-1 shrink-0">
                           <div className="scale-[0.8] origin-center drop-shadow-md">
                              <TikiToken id={tokenId} color={color} name={name} isSelected={false} disabled={true} size="sm" />
                           </div>
                        </div>
                        <div className="flex-1 text-center relative z-10 pl-2">
                            <div className="text-white font-black text-lg leading-none uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                {name.split(' ')[0]}
                            </div>
                            <div className="text-black/70 font-black text-[9px] mt-1 uppercase tracking-widest">{labels[i]}</div>
                        </div>
                    </div>
                  );
              })}
            </div>
          </div>
          </aside>
        </div>
      </main>

      {/* Cinematic Game Intro */}
      {introStep !== 'none' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-xl overflow-hidden">
          {/* Countdown Phase */}
          {introStep === 'countdown' && (
            <div key={introCount} className="text-[20rem] font-black italic text-transparent bg-clip-text bg-gradient-to-br from-[#A2E4B8] to-[#16a34a] drop-shadow-[0_0_80px_rgba(34,197,94,1)] animate-in zoom-in-50 spin-in-12 fade-in duration-700 ease-out">
              {introCount === 0 ? 'FIGHT' : introCount}
            </div>
          )}
          
          {/* Deck Reveal Phase */}
          {introStep === 'cards' && (
            <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-500">
               <h2 className="text-4xl font-black uppercase text-white tracking-[0.5em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20">The Arsenal</h2>
               <div className="relative w-full h-[250px] flex justify-center mt-16">
                  {gameState.playerHands[0]?.map((card, i) => (
                    <div 
                      key={card.id || i} 
                      className="absolute top-0 w-32 animate-in fade-in slide-in-from-top-12 duration-500 ease-out pointer-events-none drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" 
                      style={{ 
                        transform: `translateX(${(i - 3) * 130}px) rotate(${(i - 3) * 8}deg) translateY(${Math.abs(i - 3) * 15}px)`,
                        animationDelay: `${i * 150}ms`,
                        animationFillMode: 'backwards' 
                      }}>
                      <ActionCard
                        card={card}
                        isSelected={false}
                        onClick={() => {}}
                        disabled={false}
                        playerColor={config.playerColor}
                      />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Special Objectives Reveal */}
          {introStep === 'special' && (
             <div className="flex flex-col items-center justify-center gap-12 absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_80%)]">
                 <div className="text-center animate-in fade-in slide-in-from-top-10 duration-700">
                    <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_0_40px_rgba(251,191,36,0.8)] uppercase tracking-[0.3em]">Legendary Target</h2>
                 </div>
                 
                 <div className="flex gap-10 items-center bg-black/60 p-10 rounded-[3rem] shadow-[0_0_150px_rgba(245,158,11,0.5),inset_0_2px_2px_rgba(255,255,255,0.2)] border border-amber-400/30 backdrop-blur-md animate-in zoom-in-50 fade-in duration-1000 delay-300 fill-mode-both">
                    {gameState.players[0].secretTikis.map((tokenId) => {
                         const token = gameState.stack.find(t => t.id === tokenId);
                         return (
                            <div key={tokenId} className="flex flex-col items-center justify-center delay-500 animate-in fade-in zoom-in duration-500 fill-mode-both">
                               <div className="scale-[1.5] origin-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                  <TikiToken id={token!.id} color={token!.color} name={token!.name} isSelected={false} disabled={true} size="lg" />
                               </div>
                            </div>
                         );
                    })}
                 </div>
             </div>
          )}
        </div>
      )}

      {/* Overlays (Modals) */}
      {gameState.gamePhase === 'ended' && introStep === 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8 overflow-hidden animate-in fade-in duration-1000">
          {/* Ethereal Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="w-full max-w-2xl bg-black/40 border border-amber-500/30 p-16 rounded-[4rem] text-center shadow-[0_0_150px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] relative backdrop-blur-md animate-in zoom-in-75 slide-in-from-bottom-24 duration-700">
            
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-400/20 blur-[50px] rounded-full" />
            <Trophy size={120} className="mx-auto text-amber-400 drop-shadow-[0_0_60px_rgba(251,191,36,0.8)] mb-8 animate-levitate relative z-10" />
            
            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-yellow-700 mb-2 tracking-tighter italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative z-10">CHAMPION</h2>
            <p className="text-amber-200/60 font-black uppercase tracking-[0.5em] text-sm mb-12 relative z-10">The Ritual is complete</p>
            
            <div className="space-y-4 mb-12 relative z-10">
               {gameState.players.slice().sort((a,b)=> b.score - a.score).map((p, i) => (
                 <div key={p.id} className={`p-6 rounded-[2rem] border flex items-center justify-between ${p.id === gameState.winner?.id ? 'bg-amber-500/10 border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.2),inset_0_0_20px_rgba(251,191,36,0.1)] scale-105' : 'bg-black/60 border-white/5 opacity-60'}`}>
                    <div className="flex items-center gap-6">
                       <div className="font-black text-3xl text-white/30 italic">#{i+1}</div>
                       <div className="w-12 h-12 rounded-xl border border-white/20 shadow-inner" style={{ backgroundColor: p.color }} />
                       <div className="text-left">
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{p.id === gameState.winner?.id ? 'Grand Winner' : 'Contender'}</div>
                          <div className="text-2xl font-black text-white">{p.name}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-4xl font-black text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{p.score}</div>
                       <div className="text-[8px] uppercase tracking-widest text-amber-500/50 font-black">Points</div>
                    </div>
                 </div>
               ))}
            </div>
            
            <Button onClick={() => window.location.reload()} className="w-full h-24 rounded-[2rem] bg-gradient-to-br from-amber-200 to-amber-600 text-black font-black text-3xl hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(245,158,11,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)] active:scale-95 uppercase tracking-tighter relative z-10">
              Restart Ceremony
            </Button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-orange-500 italic uppercase">Ancient Laws</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRules(false)} className="rounded-full bg-zinc-900 border border-white/5"><X size={24} /></Button>
            </div>
            <div className="space-y-6 text-zinc-400 text-sm leading-relaxed font-bold uppercase tracking-tight">
               <p><span className="text-white">THE SUMMONING</span>: Arrange the totem so your 3 chosen spirits lead the ceremony.</p>
               <p><span className="text-white">TIKI TOAST</span>: The selected piece is returned to the earth. <span className="text-orange-500">Tap any piece to banish it.</span></p>
               <p><span className="text-white">MANDATORY TARGETS</span>: No card is played until both the card and the totem piece are selected.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
