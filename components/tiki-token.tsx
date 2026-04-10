"use client";

import { cn } from "@/lib/utils";
import { TikiFace } from "./tiki-face";

interface TikiTokenProps {
  id: string;
  color: string;
  name: string;
  isSelected: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  position?: number;
}

export function TikiToken({
  id,
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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center transition-all duration-300 group",
        sizeClasses[size],
        isSelected ? "z-20 scale-105" : "hover:brightness-110",
        disabled ? "cursor-default" : "cursor-pointer"
      )}
      style={{
        backgroundColor: color,
        borderRadius: '1.25rem',
        boxShadow: isSelected 
          ? `0 0 40px ${color}ff, inset 6px 0 10px rgba(255,255,255,0.4), inset -6px 0 10px rgba(0,0,0,0.5)`
          : `inset 6px 0 10px rgba(255,255,255,0.3), inset -6px 0 10px rgba(0,0,0,0.4)`,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.2) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.3) 100%),
          repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px)
        `,
      }}
    >
      <TikiFace color={color} />

      {/* Side ID Label */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 select-none opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-[10px] font-black uppercase text-zinc-500 bg-black/80 px-2 py-0.5 rounded border border-white/5 rotate-90 origin-left">
           {name.split(' ')[0]}
         </span>
      </div>

      {/* Solid Selection Frame */}
      {isSelected && (
        <div className="absolute -inset-1.5 border-[3px] border-white pointer-events-none rounded-[1.25rem] shadow-[0_0_30px_white]" />
      )}
    </button>
  );
}
