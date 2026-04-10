"use client";

import { cn } from "@/lib/utils";

interface TikiTokenProps {
  color: string;
  name: string;
  isSelected: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  position?: number;
}

export function TikiToken({
  color,
  name,
  isSelected,
  onClick,
  disabled,
  size = "md",
  position,
}: TikiTokenProps) {
  const sizeClasses = {
    sm: "w-[65px] h-[82px]",
    md: "w-[80px] h-[100px]",
    lg: "w-[100px] h-[120px]",
  };

  const isDark = isColorDark(color);
  const detailColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-300 group",
        sizeClasses[size],
        isSelected ? "z-20 scale-105" : "hover:brightness-110",
        disabled ? "cursor-default" : "cursor-pointer"
      )}
      style={{ 
        backgroundColor: color,
        boxShadow: isSelected 
          ? `0 0 40px ${color}ff, inset 8px 0 15px rgba(255,255,255,0.5), inset -8px 0 15px rgba(0,0,0,0.6)`
          : `inset 6px 0 10px rgba(255,255,255,0.4), inset -6px 0 10px rgba(0,0,0,0.5)`,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%),
          repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px)
        `,
      }}
    >
      {/* 3D Rim Highlights */}
      <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/30" />

      {/* Tiki Face Design - Solid and Carved */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-2.5 px-2">
        {/* Tribal Head Pattern */}
        <div className="w-full flex justify-center gap-1 opacity-60">
           <div className="w-3 h-1.5 rounded-sm bg-black/40" />
           <div className="w-6 h-1.5 rounded-sm bg-black/40" />
           <div className="w-3 h-1.5 rounded-sm bg-black/40" />
        </div>

        {/* Deep Set Eyes */}
        <div className="flex justify-between w-full px-1">
           <div className="w-7 h-7 rounded-lg border-2 bg-black/60 flex items-center justify-center transform -rotate-6" style={{ borderColor: detailColor }}>
              <div className="w-3 h-3 rounded-full bg-white/90 shadow-[0_0_5px_white]" />
           </div>
           <div className="w-7 h-7 rounded-lg border-2 bg-black/60 flex items-center justify-center transform rotate-6" style={{ borderColor: detailColor }}>
              <div className="w-3 h-3 rounded-full bg-white/90 shadow-[0_0_5px_white]" />
           </div>
        </div>

        {/* Carved Mouth */}
        <div className="w-11/12 h-10 rounded-xl border-[3px] bg-black/40 flex flex-col items-center justify-center gap-1 overflow-hidden" style={{ borderColor: detailColor }}>
           <div className="flex gap-1">
             {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-3 bg-white/40 rounded-sm" />)}
           </div>
           <div className="flex gap-1">
             {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-3 bg-white/40 rounded-sm" />)}
           </div>
        </div>

        {/* Side ID Label - Clear Visibility */}
        <div className="absolute bottom-4 right-1.5 select-none">
           <span className="text-[8px] font-black uppercase text-black/80 rotate-90 origin-bottom-right whitespace-nowrap">{name}</span>
        </div>
      </div>

      {/* Solid Selection Frame */}
      {isSelected && (
        <div className="absolute -inset-1.5 border-[3px] border-white pointer-events-none rounded-md shadow-[0_0_30px_white]" />
      )}
    </button>
  );
}

function isColorDark(color: string): boolean {
  if (!color || typeof color !== 'string' || !color.startsWith('#')) return true;
  const hex = color.replace('#', '');
  if (hex.length < 6) return true;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 150;
}
