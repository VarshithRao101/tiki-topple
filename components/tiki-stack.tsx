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
  return (
    <div className="relative w-full h-full flex flex-col items-center translate-x-[5.2%]">
      {/* Central Track Container - Mimicking the board's slots */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[110px] pb-[80px]">
        {/* 9 Slots Grid - Top to Bottom - NO GAP */}
        <div className="w-[85px] h-full flex flex-col gap-0 border-x border-black/10">
          {/* We generate 9 slots, filling them with tokens or empty spaces */}
          {Array.from({ length: 9 }).map((_, slotIndex) => {
            const token = tokens[slotIndex];
            const isSelected = selectedIndex === slotIndex;
            
            return (
              <div 
                key={slotIndex} 
                className="flex-1 w-full relative flex items-center justify-center rounded-lg transition-colors border-2 border-transparent"
                style={{ 
                   borderColor: isSelected ? 'rgba(251, 146, 60, 0.5)' : 'transparent'
                }}
              >
                {token && (
                  <div
                    className="relative w-full h-full flex items-center justify-center p-1 transition-all duration-500 ease-in-out"
                    style={{
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <TikiToken
                      color={token.color}
                      name={token.name}
                      isSelected={isSelected}
                      onClick={() => !disabled && onSelectToken(slotIndex)}
                      disabled={disabled}
                      size="sm"
                      position={slotIndex + 1}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
