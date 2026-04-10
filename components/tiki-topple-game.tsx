"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/hooks/use-game";
import { TikiStack } from "./tiki-stack";
import { ActionCard } from "./action-card";
import { GameSetup, GameConfig } from "./game-setup";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { RotateCcw, HelpCircle, X, Shield, Trophy, Loader2 } from "lucide-react";

export function TikiToppleGame() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const {
    gameState,
    startGame,
    selectToken,
    selectCard,
    executeAction,
    nextRound,
  } = useGame();

  useEffect(() => {
    socket.on("waiting-for-opponent", (data) => {
      setIsWaiting(true);
      if (data?.current) setRoomStatus({ current: data.current, total: data.total });
    });

    socket.on("game-start", () => {
      setIsWaiting(false);
      setMatchFound(true);
    });

    socket.on("player-disconnected", () => {
      alert("Opponent disconnected");
      window.location.reload();
    });

    socket.on("room-update", (status) => setRoomStatus(status));

    return () => {
      socket.off("waiting-for-opponent");
      socket.off("game-start");
      socket.off("player-disconnected");
      socket.off("room-update");
    };
  }, []);

  const handleStart = (newConfig: GameConfig) => {
    setConfig(newConfig);
    startGame(newConfig);
  };

  // Auto-execute logic removed (moved to selection handlers for reliability)

  if (gameState.gamePhase === "setup" || !config) {
    return <GameSetup onStart={handleStart} />;
  }

  const [roomStatus, setRoomStatus] = useState({ current: 1, total: config.numPlayers });

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6" />
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Waiting for Opponents</h2>
        <div className="text-orange-500 text-6xl font-black mb-4">{roomStatus.current} / {roomStatus.total}</div>
        <p className="text-zinc-500 text-lg uppercase tracking-widest font-bold">Room ID: {gameState.roomCode}</p>
        <p className="text-zinc-700 mt-8 text-sm max-w-xs text-center font-bold">The game will start automatically when all players join.</p>
      </div>
    );
  }

  const myPlayerIndex = gameState.players.findIndex(p => p.id === socket.id) !== -1 
    ? gameState.players.findIndex(p => p.id === socket.id) 
    : 0;
  
  const isMyTurn = gameState.currentPlayerIndex === myPlayerIndex;
  const myHand = gameState.playerHands[myPlayerIndex] || [];
  
  // Multiple opponents
  const opponents = gameState.players.filter((_, idx) => idx !== myPlayerIndex);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black tracking-tighter text-orange-500 italic uppercase">Ticket Topple</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 rounded-lg px-3 py-1 text-[10px] font-black uppercase text-zinc-500">
                <Shield size={12} className="text-blue-500" />
                {gameState.mode === 'online' ? `ROOM: ${gameState.roomCode}` : `BOT MODE (${gameState.players.length}P)`}
             </div>
             <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-orange-500">
                Round {gameState.currentRound} / {gameState.totalRounds}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowRules(true)} className="hover:bg-zinc-800 text-zinc-500">
            <HelpCircle size={18} />
          </Button>
        </div>
      </header>

      {/* Main Game Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Opponents Hands (Top) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8 z-30">
          {opponents.map((opp, idx) => {
            const oppIdx = gameState.players.findIndex(p => p.id === opp.id);
            const handCount = gameState.playerHands[oppIdx]?.length || 0;
            const isActive = gameState.currentPlayerIndex === oppIdx;
            
            return (
              <div key={opp.id} className={`flex items-center gap-2 transition-all ${isActive ? 'scale-110' : 'opacity-60'}`}>
                <div className="flex -space-x-4">
                  {Array.from({ length: Math.min(handCount, 7) }).map((_, i) => (
                    <div key={i} className="w-6 h-9 bg-zinc-900 border border-white/10 rounded-sm shadow-lg flex items-center justify-center -rotate-6">
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                   <div className="text-[7px] font-black uppercase text-zinc-600">Opponent</div>
                   <div className={`text-[10px] font-black leading-none ${isActive ? 'text-orange-500' : 'text-white'}`}>{opp.name}</div>
                   <div className="text-[8px] font-bold text-zinc-500">{opp.score} PTS</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Board Container (Center-Left) */}
        <div className="flex-[3] relative flex items-center justify-start pl-[15%] bg-black overflow-hidden">
          <div className="relative h-[90%] aspect-[9/18] flex items-center justify-center">
             {/* Dynamic background could go here */}
             <div className="absolute inset-0 bg-zinc-900/20 rounded-[3rem] blur-3xl" />
             <TikiStack
                tokens={gameState.stack}
                selectedIndex={gameState.selectedTokenIndex}
                onSelectToken={selectToken}
                disabled={!isMyTurn || gameState.gamePhase !== "playing" || !gameState.selectedCard}
              />
          </div>

          {/* Turn Indicator */}
          <div className="absolute top-1/2 -translate-y-1/2 right-8">
             <div className={`p-1 rounded-full ${isMyTurn ? 'bg-orange-500' : 'bg-zinc-800'} animate-pulse`} />
          </div>
        </div>

        {/* Right Sidebar: Player Deck (Vertical Alignment) */}
        <aside className="w-[320px] bg-zinc-950 border-l border-white/5 flex flex-col p-6 z-10 box-border">
          <div className="mb-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Your Hand</div>
             <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {myHand.map((card) => (
                  <ActionCard
                    key={card.id}
                    card={card}
                    isSelected={gameState.selectedCard?.id === card.id}
                    onClick={() => selectCard(card)}
                    disabled={!isMyTurn || gameState.gamePhase !== "playing"}
                  />
                ))}
             </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Your Identity</div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
               <div className="w-10 h-10 rounded-lg shadow-xl" style={{ backgroundColor: gameState.players[myPlayerIndex].color }} />
               <div>
                  <div className="text-sm font-black text-white leading-none mb-1">{gameState.players[myPlayerIndex].name}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">{gameState.players[myPlayerIndex].score} Points</div>
               </div>
            </div>

            {/* Secret Objectives (Simplified for UI space) */}
            <div className="space-y-2">
               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Objectives</div>
               <div className="grid grid-cols-3 gap-2">
                  {gameState.players[myPlayerIndex].secretTikis.map((tokenId, idx) => {
                    const token = gameState.stack.find(t => t.id === tokenId);
                    const pos = gameState.stack.findIndex(t => t.id === tokenId);
                    return (
                      <div key={idx} className="aspect-square rounded-lg flex items-center justify-center border border-white/10 relative overflow-hidden" 
                           style={{ backgroundColor: token?.color || '#222' }}>
                        <div className="text-white font-black text-[10px] z-10 drop-shadow-md">
                          {idx === 0 ? "1ST" : idx === 1 ? "2ND" : "3RD"}
                        </div>
                        {pos !== -1 && pos <= 2 && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Round Result Modal */}
      {gameState.gamePhase === 'roundEnded' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8">
          <div className="w-full max-w-xl bg-zinc-900 border border-white/5 p-12 rounded-[3.5rem] text-center shadow-[0_0_100px_rgba(251,146,60,0.1)]">
            <h2 className="text-4xl font-black text-orange-500 mb-2 tracking-tighter italic uppercase">Round {gameState.currentRound} Complete</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">Standings after this round</p>
            
            <div className="space-y-4 mb-12">
               {gameState.players.map((p, i) => (
                 <div key={p.id} className="p-4 rounded-2xl border border-white/5 bg-black/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: p.color }} />
                       <div className="text-left">
                          <div className="text-[10px] font-black uppercase text-zinc-500">{p.name}</div>
                          <div className="text-xl font-black text-white">{p.score} <span className="text-xs uppercase text-zinc-600">PTS</span></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <Button onClick={nextRound} className="w-full h-20 rounded-[2rem] bg-orange-600 text-white font-black text-2xl hover:bg-orange-700 transition-all shadow-2xl active:scale-95 shadow-[0_0_30px_rgba(234,88,12,0.3)] uppercase italic">
              Continue To Next Round
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState.gamePhase === 'ended' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8">
          <div className="w-full max-w-xl bg-zinc-900 border border-white/5 p-12 rounded-[3.5rem] text-center shadow-[0_0_100px_rgba(251,146,60,0.1)]">
            <h2 className="text-6xl font-black text-white mb-8 tracking-tighter italic">GAME OVER</h2>
            <div className="space-y-4 mb-12">
               {gameState.players.map((p, i) => (
                 <div key={p.id} className={`p-6 rounded-[2rem] border flex items-center justify-between ${gameState.winner?.id === p.id ? 'bg-orange-600/10 border-orange-500/20' : 'bg-black border-white/5 opacity-50'}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: p.color }} />
                       <div className="text-left">
                          <div className="text-[10px] font-black uppercase text-zinc-500">{p.name}</div>
                          <div className="text-2xl font-black text-white">{p.score} <span className="text-xs uppercase text-zinc-600">PTS</span></div>
                       </div>
                    </div>
                    {gameState.winner?.id === p.id && <Trophy size={24} className="text-orange-500" />}
                 </div>
               ))}
            </div>
            <Button onClick={() => window.location.reload()} className="w-full h-20 rounded-[2rem] bg-white text-black font-black text-2xl hover:bg-zinc-200 transition-all shadow-2xl active:scale-95">BACK TO MENU</Button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-orange-500 italic uppercase">How to Play</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRules(false)} className="rounded-full bg-zinc-900 border border-white/5"><X size={24} /></Button>
            </div>
            <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
               <p><span className="text-white font-black uppercase">Objective</span>: Move your secret tikis into the top 3 spots by playing power cards.</p>
               <p><span className="text-white font-black uppercase">Power Cards</span>: Play cards to move tikis up, topple them to the bottom, or toast (remove) them from the board.</p>
               <p><span className="text-white font-black uppercase">Ending</span>: The game ends when only 3 tikis remain or all cards are played.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
