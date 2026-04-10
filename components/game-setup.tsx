"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, Globe, Shield, User, Gamepad2 } from "lucide-react";

interface GameSetupProps {
  onStart: (config: GameConfig) => void;
}

export interface GameConfig {
  playerName: string;
  playerColor: string;
  mode: "bot" | "online";
  playerCount: number;
  roomCode?: string;
  roomPassword?: string;
  action?: 'create' | 'join';
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const [playerColor, setPlayerColor] = useState("#FF1744");
  const [mode, setMode] = useState<"bot" | "online">("bot");
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [roomAction, setRoomAction] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  const colors = [
    { name: "Red", value: "#FF1744" },
    { name: "Orange", value: "#FF9100" },
    { name: "Yellow", value: "#FFEA00" },
    { name: "Green", value: "#00E676" },
    { name: "Blue", value: "#00E5FF" },
    { name: "Purple", value: "#D500F9" },
  ];

  const handleStart = () => {
    if (!playerName.trim()) return;
    if (mode === "online" && !roomCode.trim()) return;

    onStart({
      playerName,
      playerColor,
      mode,
      playerCount,
      roomCode: mode === "online" ? roomCode : undefined,
      roomPassword: mode === "online" ? roomPassword : undefined,
      action: mode === "online" ? roomAction : undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/aefd765b7818675865c07e4260982ba7.jpg')] bg-cover bg-center p-4 font-sans relative overflow-hidden">
      {/* Radial vignette so the center of the image pops but the edges get dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,10,0,0.9)_100%)] pointer-events-none" />
      
      {/* Decorative Light Flares */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-[500px] border-t border-white/20 border-l border-white/10 border-r border-black/50 border-b border-black/80 bg-black/30 backdrop-blur-3xl text-white shadow-[0_0_80px_-20px_rgba(34,197,94,0.4),0_30px_60px_rgba(0,0,0,0.8)] rounded-[3rem] overflow-hidden animate-in fade-in zoom-in-95 duration-700 ease-out">
        <CardHeader className="text-center p-10 pb-6 bg-transparent">
          <CardTitle className="text-6xl font-black tracking-tighter italic bg-gradient-to-br from-[#E2F0CB] via-[#A2E4B8] to-[#16a34a] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            TIKI TOPPLE
          </CardTitle>
          <CardDescription className="text-green-300/60 font-black uppercase text-[10px] tracking-[0.3em] mt-3 drop-shadow-sm">
            Jungle Totem Championship
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-10 pb-10 space-y-8">
          {/* Identity Section */}
          <div className="grid grid-cols-2 gap-6 relative">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[9px] font-black uppercase text-green-400 tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                <User size={12} className="text-green-300" /> Player Identity
              </Label>
              <Input
                id="name"
                placeholder="NICKNAME"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-black/60 border border-t-black border-l-black border-r-white/10 border-b-white/10 h-14 text-xl font-black tracking-tighter text-emerald-50 placeholder:text-green-500/30 focus:border-green-400 focus:bg-black/80 focus:ring-green-400/20 focus:shadow-[inset_0_0_20px_rgba(34,197,94,0.1),0_0_15px_rgba(34,197,94,0.3)] rounded-2xl transition-all shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[9px] font-black uppercase text-green-400 tracking-[0.2em] drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">Aura Color</Label>
              <div className="flex justify-between items-center h-14 bg-black/40 rounded-2xl px-3 border border-white/5 shadow-inner">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setPlayerColor(c.value)}
                    className={`w-6 h-6 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none ${
                      playerColor === c.value 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-[1.35] z-10' 
                        : 'opacity-40 grayscale-[40%] hover:opacity-80'
                    }`}
                    style={{ 
                       backgroundColor: c.value,
                       boxShadow: playerColor === c.value ? `0 0 15px ${c.value}` : 'inset 0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          {/* Player Count & Basic Mode */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-[9px] font-black uppercase text-green-400 tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                <Users size={12} className="text-green-300" /> Player Count
              </Label>
              <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                 {[2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setPlayerCount(num)}
                      className={`flex-1 h-10 rounded-xl font-black text-sm transition-all duration-300 ${
                        playerCount === num 
                        ? 'bg-gradient-to-b from-green-400 to-green-600 text-black shadow-[0_4px_10px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]' 
                        : 'bg-transparent text-green-200/40 hover:text-green-200 hover:bg-white/5'
                      }`}
                    >
                      {num}P
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[9px] font-black uppercase text-green-400 tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                <Gamepad2 size={12} className="text-green-300" /> Network Mode
              </Label>
              <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                <button
                  onClick={() => setMode('bot')}
                  className={`flex-1 h-10 rounded-xl font-black text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    mode === 'bot' 
                    ? 'bg-gradient-to-b from-emerald-300 to-emerald-500 text-emerald-950 shadow-[0_4px_10px_rgba(52,211,153,0.4),0_0_20px_rgba(52,211,153,0.2)] scale-[1.02]' 
                    : 'bg-transparent text-green-200/40 hover:text-green-200 hover:bg-white/5'
                  }`}
                >
                  <Bot size={14} /> Bot
                </button>
                <button
                  onClick={() => setMode('online')}
                  className={`flex-1 h-10 rounded-xl font-black text-[10px] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    mode === 'online' 
                    ? 'bg-gradient-to-b from-green-400 to-green-600 text-black shadow-[0_4px_10px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]' 
                    : 'bg-transparent text-green-200/40 hover:text-green-200 hover:bg-white/5'
                  }`}
                >
                  <Globe size={14} /> Online
                </button>
              </div>
            </div>
          </div>

          {/* Multiplayer Extensions */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mode === 'online' ? 'max-h-[200px] opacity-100 mt-6' : 'max-h-0 opacity-0 m-0'}`}>
            <div className="space-y-6 bg-black/20 rounded-3xl p-6 border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="flex bg-black/80 rounded-xl p-1 gap-1 border border-green-500/10 shadow-inner">
                 <button 
                  onClick={() => setRoomAction('create')}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all ${roomAction === 'create' ? 'bg-green-900/40 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] border border-green-500/30' : 'bg-transparent text-green-200/30 hover:text-green-200/60'}`}
                 >
                   Create Room
                 </button>
                 <button 
                  onClick={() => setRoomAction('join')}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all ${roomAction === 'join' ? 'bg-green-900/40 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] border border-green-500/30' : 'bg-transparent text-green-200/30 hover:text-green-200/60'}`}
                 >
                   Join Room
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[8px] font-black uppercase text-green-500/70 tracking-widest pl-1">Room ID</Label>
                  <Input
                    placeholder="ID: 1234"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="bg-black/60 border-t-black border-l-black border-b-white/10 border-r-white/10 h-10 rounded-xl font-black text-sm text-center text-white placeholder:text-green-500/20 focus:border-green-400 focus:bg-black/80 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[8px] font-black uppercase text-green-500/70 tracking-widest pl-1">Password (Opt)</Label>
                  <Input
                    type="password"
                    placeholder="****"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="bg-black/60 border-t-black border-l-black border-b-white/10 border-r-white/10 h-10 rounded-xl font-black text-sm text-center text-white placeholder:text-green-500/20 focus:border-green-400 focus:bg-black/80 shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-10 pb-10 pt-2 border-t border-white/5 bg-gradient-to-b from-transparent to-black/40">
          <Button
            onClick={handleStart}
            disabled={!playerName.trim() || (mode === 'online' && !roomCode.trim())}
            className="group relative w-full h-24 rounded-[2rem] bg-gradient-to-b from-green-400 to-green-600 text-black font-black text-3xl tracking-tighter hover:scale-[1.03] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 overflow-hidden"
          >
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] -translate-x-[150%] skew-x-[-30deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
            <span className="relative drop-shadow-[0_2px_2px_rgba(255,255,255,0.7)] z-10">ENTER THE JUNGLE</span>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Branding Footer */}
      <div className="fixed bottom-8 flex flex-col items-center gap-1 z-10 opacity-70">
        <div className="text-[9px] font-black uppercase tracking-[0.6em] text-green-200/40">Engineered for victory</div>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-green-500/50 to-transparent rounded-full" />
      </div>
    </div>
  );
}
