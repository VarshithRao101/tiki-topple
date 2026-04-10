"use client";

import { cn } from "@/lib/utils";

interface TikiFaceProps {
  color: string;
  className?: string;
}

export function TikiFace({ color, className }: TikiFaceProps) {
  const isDark = isColorDark(color);
  const detailColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)";

  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-between py-3 px-2", className)}>
      {/* Tribal Head Pattern */}
      <div className="w-full flex justify-center gap-1 opacity-40">
        <div className="w-3 h-1.5 rounded-sm bg-black/40" />
        <div className="w-6 h-1.5 rounded-sm bg-black/40" />
        <div className="w-3 h-1.5 rounded-sm bg-black/40" />
      </div>

      {/* Deep Set Eyes */}
      <div className="flex justify-between w-full px-1">
        <div 
          className="w-7 h-7 rounded-lg border-2 bg-black/60 flex items-center justify-center transform -rotate-6 shadow-xl" 
          style={{ borderColor: detailColor }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_8px_white]" />
        </div>
        <div 
          className="w-7 h-7 rounded-lg border-2 bg-black/60 flex items-center justify-center transform rotate-6 shadow-xl" 
          style={{ borderColor: detailColor }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_8px_white]" />
        </div>
      </div>

      {/* Carved Mouth */}
      <div 
        className="w-11/12 h-10 rounded-xl border-[3px] bg-black/40 flex flex-col items-center justify-center gap-1 overflow-hidden shadow-inner" 
        style={{ borderColor: detailColor }}
      >
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="w-2 h-3 bg-white/30 rounded-sm" />)}
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="w-2 h-3 bg-white/30 rounded-sm" />)}
        </div>
      </div>
    </div>
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
