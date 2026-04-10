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
    sm: "w-[50px] h-[50px]",
    md: "w-[65px] h-[65px]",
    lg: "w-[80px] h-[80px]",
  };

  const isDark = isColorDark(color);
  const detailColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-300 group rounded-full",
        sizeClasses[size],
        isSelected ? "z-20 scale-110 shadow-[0_0_25px_white]" : "hover:brightness-110 shadow-lg",
        disabled ? "cursor-default" : "cursor-pointer"
      )}
      style={{ 
        backgroundColor: color,
        boxShadow: isSelected 
          ? `0 0 30px ${color}aa, inset 4px 4px 10px rgba(255,255,255,0.4), inset -4px -4px 10px rgba(0,0,0,0.5)`
          : `inset 3px 3px 6px rgba(255,255,255,0.3), inset -3px -3px 6px rgba(0,0,0,0.4)`,
        backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
          repeating-conic-gradient(from 0deg, rgba(0,0,0,0.05) 0deg 10deg, transparent 10deg 20deg)
        `,
      }}
    >
      {/* Coin Edge Detail */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none" />
      
      {/* Carved Center Pattern */}
      <div className="w-[80%] h-[80%] rounded-full border border-black/10 flex flex-col items-center justify-center relative overflow-hidden bg-black/5">
        <div className="text-[10px] font-black uppercase text-black/60 rotate-0 select-none tracking-tighter leading-none mb-0.5">{name.split(' ')[0]}</div>
        <div className="w-4 h-0.5 bg-black/20 rounded-full" />
      </div>

      {/* Modern Highlight */}
      <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/20 rounded-full blur-[1px] rotate-[-45deg]" />

      {/* Selection Ring */}
      {isSelected && (
        <div className="absolute -inset-2 border-2 border-white rounded-full animate-pulse pointer-events-none" />
      )}
    </button>
  );
}
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
