"use client";

import { cn } from "@/lib/utils";
import type { Card } from "@/lib/game-types";

interface ActionCardProps {
  card: Card;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  playerColor?: string;
}

export function ActionCard({ card, isSelected, onClick, disabled, playerColor }: ActionCardProps) {
  const cardName = card.type === 'tiki-up' 
    ? 'TIKI UP' 
    : card.type === 'tiki-topple' 
    ? 'TIKI TOPPLE' 
    : 'TIKI TOAST';

  const symbol = card.type === 'tiki-up' 
    ? card.value?.toString() 
    : card.type === 'tiki-topple' 
    ? '↓' 
    : 'X';

  const cornerLabel = card.type === 'tiki-up' 
    ? card.value?.toString() 
    : card.type === 'tiki-topple' 
    ? '↓' 
    : 'X';

  const baseColor = playerColor || '#d97706';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center w-full aspect-[2/3] rounded-xl transition-all duration-300 overflow-hidden border-2",
        isSelected
          ? "ring-4 scale-105 z-10"
          : "hover:scale-[1.02] shadow-xl animate-levitate",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
      style={{
          borderColor: isSelected ? 'white' : 'white',
          boxShadow: isSelected ? `0 0 30px ${baseColor}` : 'none'
      }}
    >
      {/* Dynamic Player Color Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: baseColor,
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.4) 100%),
            repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 2px)
          `,
        }}
      />
      
      {/* Corner Icons */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-black/30 bg-black/20 flex items-center justify-center text-[10px] font-black text-black/80 shadow-inner">
        {cornerLabel}
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full border border-black/30 bg-black/20 flex items-center justify-center text-[10px] font-black text-black/80 shadow-inner">
        {cornerLabel}
      </div>

      {/* Left Track Indicator */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-3/5 bg-black/30 border border-black/20 rounded-sm flex flex-col justify-between p-0.5">
         {[1,2,3,4,5].map(i => (
           <div key={i} className={cn("w-full h-2 rounded-[1px] bg-black/20", i === 5 && "border border-white/50 bg-white/80 shadow-[0_0_5px_white]")} />
         ))}
      </div>

      {/* Card Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8">
        {/* Curved Title */}
        <div className="absolute top-6 w-full text-center mix-blend-color-burn">
           <span className="text-[12px] font-black tracking-widest text-black/90 uppercase scale-x-125">
             {cardName}
           </span>
        </div>

        {/* Big Central Symbol */}
        <div 
          className="text-7xl font-black text-black/80 drop-shadow-2xl select-none transform scale-y-110 mix-blend-color-burn"
          style={{ textShadow: '2px 2px 0 rgba(255,255,255,0.3)' }}
        >
          {symbol}
        </div>
      </div>

      {/* Inner Frame */}
      <div className="absolute inset-1 border border-black/20 rounded-lg pointer-events-none" />
    </button>
  );
}
