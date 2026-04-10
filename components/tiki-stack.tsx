"use client";

import type { Token } from "@/lib/game-types";
import { TikiToken } from "./tiki-token";

interface TikiStackProps {
  tokens: Token[];
  selectedIndex: number | null;
  onSelectToken: (index: number) => void;
  disabled: boolean;
  animatingAction?: { type: string, index: number } | null;
}

export function TikiStack({
  tokens,
  selectedIndex,
  onSelectToken,
  disabled,
  animatingAction,
}: TikiStackProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Central Track Container - Mimicking the board's physical slot perfectly */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[18%] pb-[4%]">
        {/* 9 Slots Grid - Vertically Spaced Proportional to Path */}
        <div className="w-[18%] h-full flex flex-col gap-[1%] p-[0.5%]">
          {Array.from({ length: 9 }).map((_, slotIndex) => {
            const token = tokens[slotIndex];
            const isSelected = selectedIndex === slotIndex;
            const isAnimating = animatingAction?.index === slotIndex;
            
            let animationClass = "";
            if (isAnimating) {
               if (animatingAction.type === 'tiki-toast') animationClass = "animate-fire-blast";
               else if (animatingAction.type === 'tiki-topple') animationClass = "animate-wind-down";
               else if (animatingAction.type === 'tiki-up') animationClass = "animate-wind-up";
            }
            
            return (
              <div 
                key={slotIndex} 
                className={`flex-1 w-full relative flex items-center justify-center rounded-[1.5rem] transition-all border-2 ${isSelected ? 'border-orange-500 bg-zinc-800/80 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-zinc-900/40'}`}
                style={{ 
                   boxShadow: isSelected ? '0 0 20px rgba(249,115,22,0.3), inset 0 4px 10px rgba(0,0,0,0.5)' : 'inset 0 4px 10px rgba(0,0,0,0.5)'
                }}
              >
                {token && (
                  <div
                    className={`relative w-full h-full flex items-center justify-center p-2 transition-all duration-500 ease-in-out ${animationClass}`}
                    style={{
                      transform: isSelected && !isAnimating ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <TikiToken
                      id={token.id}
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
