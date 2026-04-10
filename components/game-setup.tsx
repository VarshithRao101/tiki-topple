"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Globe, Shield, User, Key, Users } from "lucide-react";

interface GameSetupProps {
  onStart: (config: GameConfig) => void;
}

export interface GameConfig {
  playerName: string;
  playerColor: string;
  numPlayers: number;
  mode: "bot" | "online";
  isCreating?: boolean;
  roomCode?: string;
  password?: string;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const [playerColor, setPlayerColor] = useState("#FF1744");
  const [numPlayers, setNumPlayers] = useState(2);
  const [mode, setMode] = useState<"bot" | "online">("online");
  const [isCreating, setIsCreating] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");

  const colors = [
    { name: "Red", value: "#FF1744" },
    { name: "Orange", value: "#FF9100" },
    { name: "Yellow", value: "#FFEA00" },
    {name: "Green", value: "#00E676" },
    {name: "Purple", value: "#D500F9" },
  ];

  const handleStart = () => {
    if (!playerName.trim()) return;
    onStart({
      playerName,
      playerColor,
      numPlayers,
      mode,
      isCreating: mode === "online" ? isCreating : undefined,
      roomCode: mode === "online" && !isCreating ? roomCode : undefined,
      password: mode === "online" ? password : undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-4xl font-black tracking-tighter text-orange-500 uppercase italic">
            Ticket Topple
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Set up your identity and join the arena
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300 flex items-center gap-2">
              <User size={16} /> Player Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Color</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setPlayerColor(c.value)}
                    className={`h-9 rounded-lg transition-all flex items-center justify-center text-[10px] font-bold border border-white/10 ${
                      playerColor === c.value ? "ring-2 ring-white scale-105" : "opacity-40"
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Players Selection */}
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Users size={16} /> Players
              </Label>
              <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumPlayers(n)}
                    className={`flex-1 py-1 px-2 rounded-md font-black text-xs transition-all ${
                      numPlayers === n ? "bg-orange-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {n}P
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Game Mode */}
          <div className="space-y-3">
            <Label className="text-zinc-300">Select Mode</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as any)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <RadioGroupItem value="bot" id="bot" className="border-zinc-700" />
                <Label htmlFor="bot" className="flex items-center gap-2 cursor-pointer">
                  <Bot size={18} className="text-orange-400" /> Bot
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <RadioGroupItem value="online" id="online" className="border-zinc-700" />
                <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                  <Globe size={18} className="text-blue-400" /> Online
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Online Options */}
          {mode === "online" && (
            <div className="space-y-4 pt-4 border-t border-zinc-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <Button 
                  variant={isCreating ? "default" : "secondary"}
                  className={`flex-1 font-black uppercase text-xs tracking-tighter h-10 transition-all ${
                    isCreating 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)]' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500 border border-white/5'
                  }`}
                  onClick={() => setIsCreating(true)}
                >
                  Create Room
                </Button>
                <Button 
                  variant={!isCreating ? "default" : "secondary"}
                  className={`flex-1 font-black uppercase text-xs tracking-tighter h-10 transition-all ${
                    !isCreating 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-500 border border-white/5'
                  }`}
                  onClick={() => setIsCreating(false)}
                >
                  Join Room
                </Button>
              </div>

              {!isCreating && (
                <div className="space-y-2 animate-in zoom-in-95">
                  <Label htmlFor="room" className="text-zinc-300 flex items-center gap-2">
                    <Shield size={16} /> Room ID
                  </Label>
                  <Input
                    id="room"
                    placeholder="Enter Room ID"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              )}

              <div className="space-y-2 animate-in zoom-in-95">
                <Label htmlFor="pass" className="text-zinc-300 flex items-center gap-2">
                  <Key size={16} /> {isCreating ? "Set Password" : "Room Password"}
                </Label>
                <Input
                  id="pass"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className={`w-full text-white font-black h-12 text-lg transition-all active:scale-95 uppercase italic tracking-tighter ${
              mode === "bot" 
                ? "bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                : isCreating 
                  ? "bg-orange-600 hover:bg-orange-700 shadow-[0_0_20px_rgba(234,88,12,0.3)]" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            }`}
          >
            {mode === "bot" ? "START OFFLINE" : isCreating ? "CREATE ROOM" : "JOIN ROOM"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
