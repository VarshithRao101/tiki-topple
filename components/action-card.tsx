"use client";

import { cn } from "@/lib/utils";
import type { Card } from "@/lib/game-types";

interface ActionCardProps {
  card: Card;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionCard({ card, isSelected, onClick, disabled }: ActionCardProps) {
  const cardName = card.type === 'tiki-up' 
    ? `+${card.value}` 
    : card.type === 'tiki-topple' 
    ? 'TICKET TOPPLE' 
    : 'TICKET TOAST';

  const symbol = card.type === 'tiki-up' 
    ? `+${card.value}` 
    : card.type === 'tiki-topple' 
    ? '↓' 
    : 'X';

  const cornerLabel = card.type === 'tiki-up' 
    ? card.value?.toString() 
    : card.type === 'tiki-topple' 
    ? '↓' 
    : 'X';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center w-full aspect-[2/3] rounded-xl transition-all duration-300 overflow-hidden border-2 border-white",
        isSelected
          ? "ring-4 ring-orange-400 scale-105 z-10 shadow-[0_0_30px_rgba(251,146,60,0.4)]"
          : "hover:scale-[1.02] shadow-xl",
        disabled && "opacity-50 cursor-not-allowed grayscale"
      )}
    >
      {/* Wood Texture Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#d97706',
          backgroundImage: `
            radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%),
            repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 2px)
          `,
        }}
      />
      
      {/* Corner Icons */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border border-black/30 bg-orange-800/20 flex items-center justify-center text-[10px] font-black text-black/60 shadow-inner">
        {cornerLabel}
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full border border-black/30 bg-orange-800/20 flex items-center justify-center text-[10px] font-black text-black/60 shadow-inner">
        {cornerLabel}
      </div>

      {/* Left Track Indicator */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-3/5 bg-orange-950/40 border border-black/20 rounded-sm flex flex-col justify-between p-0.5">
         {[1,2,3,4,5].map(i => (
           <div key={i} className={cn("w-full h-2 rounded-[1px] bg-black/20", i === 5 && "border border-orange-400 bg-orange-500/80 shadow-[0_0_5px_orange]")} />
         ))}
      </div>

      {/* Card Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8">
        {/* Curved Title */}
        <div className="absolute top-6 w-full text-center">
           <span className="text-[12px] font-black tracking-widest text-[#451a03] uppercase scale-x-125">
             {cardName}
           </span>
        </div>

        {/* Big Central Symbol */}
        <div 
          className="text-7xl font-black text-[#27160c] drop-shadow-2xl select-none transform scale-y-110"
          style={{ textShadow: '2px 2px 0 rgba(255,255,255,0.1)' }}
        >
          {symbol}
        </div>
      </div>

      {/* Inner Frame */}
      <div className="absolute inset-1 border border-black/10 rounded-lg pointer-events-none" />
    </button>
  );
}
