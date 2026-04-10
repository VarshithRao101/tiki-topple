"use client";

import type { Token } from "@/lib/game-types";
import { TikiToken } from "./tiki-token";

interface TikiStackProps {
  tokens: Token[];
  selectedIndex: number | null;
  onSelectToken: (index: number) => void;
  disabled: boolean;
}

export function TikiStack({
  tokens,
  selectedIndex,
  onSelectToken,
  disabled,
}: TikiStackProps) {
  // Tile coordinates from the provided HTML/CSS
  const tilePositions = [
    { top: "92%", left: "10%", id: 1 }, { top: "88%", left: "12%", id: 2 },
    { top: "84%", left: "9%", id: 3 }, { top: "80%", left: "11%", id: 4 },
    { top: "76%", left: "8%", id: 5 }, { top: "72%", left: "12%", id: 6 },
    { top: "68%", left: "10%", id: 7 }, { top: "64%", left: "8%", id: 8 },
    { top: "60%", left: "11%", id: 9 }, { top: "56%", left: "9%", id: 10 },
    { top: "52%", left: "11%", id: 11 }, { top: "48%", left: "8%", id: 12 },
    { top: "44%", left: "10%", id: 13 }, { top: "40%", left: "12%", id: 14 },
    { top: "36%", left: "9%", id: 15 }, { top: "32%", left: "11%", id: 16 },
    { top: "28%", left: "8%", id: 17 }, { top: "22%", left: "35%", id: 18 },
    { top: "22%", right: "35%", id: 19 }, { top: "20%", right: "25%", id: 20 },
    { top: "28%", right: "10%", id: 21 }, { top: "32%", right: "8%", id: 22 },
    { top: "36%", right: "11%", id: 23 }, { top: "40%", right: "9%", id: 24 },
    { top: "44%", right: "11%", id: 25 }, { top: "48%", right: "8%", id: 26 },
    { top: "52%", right: "10%", id: 27 }, { top: "56%", right: "12%", id: 28 },
    { top: "60%", right: "9%", id: 29 }, { top: "64%", right: "11%", id: 30 },
    { top: "68%", right: "8%", id: 31 }, { top: "72%", right: "10%", id: 32 },
    { top: "76%", right: "12%", id: 33 }, { top: "80%", right: "9%", id: 34 },
    { top: "84%", right: "11%", id: 35 }
  ];

  return (
    <div className="relative w-[400px] h-[800px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900 mx-auto"
         style={{ backgroundImage: 'url("/board.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Central Bridge (Decorative) */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[60px] h-[72%] bg-gradient-to-b from-[#6b4423]/20 to-[#3b2612]/30 rounded-xl" />

      {/* Path Tiles & Tokens */}
      {tilePositions.map((pos, idx) => {
        // Place Tikis in the first 9 positions as a "stack"
        const token = idx < 9 ? tokens[idx] : null;
        const isSelected = selectedIndex === idx;

        return (
          <div 
            key={pos.id}
            className="absolute w-[38px] h-[38px] flex items-center justify-center bg-black/35 backdrop-blur-[4px] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.6)] text-[10px] font-black text-white/40"
            style={{ 
              top: pos.top, 
              left: pos.left, 
              right: (pos as any).right 
            }}
          >
            {token ? (
              <div className="absolute z-10 scale-[1.3]">
                <TikiToken
                  color={token.color}
                  name={token.name}
                  isSelected={isSelected}
                  onClick={() => !disabled && onSelectToken(idx)}
                  disabled={disabled}
                  size="sm"
                  position={idx + 1}
                />
              </div>
            ) : (
              pos.id
            )}
          </div>
        );
      })}
    </div>
  );
}
