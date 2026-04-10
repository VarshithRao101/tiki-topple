"use client";

export function GameBoardBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main turquoise background matching original box */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #00ACC1 0%, #26C6DA 50%, #4DD0E1 100%)',
        }}
      />

      {/* Cloud wisps at top */}
      <div className="absolute top-0 left-0 right-0 h-20 opacity-30">
        <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
          <ellipse cx="50" cy="40" rx="60" ry="25" fill="white" opacity="0.5" />
          <ellipse cx="150" cy="30" rx="80" ry="30" fill="white" opacity="0.4" />
          <ellipse cx="280" cy="45" rx="70" ry="25" fill="white" opacity="0.5" />
          <ellipse cx="380" cy="35" rx="50" ry="20" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Parrot on right side */}
      <div className="absolute top-8 right-4 md:right-12 w-16 h-20 md:w-24 md:h-28">
        <svg viewBox="0 0 60 80" className="w-full h-full">
          {/* Body */}
          <ellipse cx="30" cy="45" rx="18" ry="25" fill="#E53935" />
          <ellipse cx="30" cy="45" rx="15" ry="22" fill="#EF5350" />
          {/* Wing */}
          <ellipse cx="40" cy="50" rx="12" ry="18" fill="#C62828" />
          {/* Head */}
          <circle cx="30" cy="22" r="14" fill="#E53935" />
          <circle cx="30" cy="22" r="12" fill="#EF5350" />
          {/* Beak */}
          <path d="M18 25 Q12 28 15 32 L24 28 Z" fill="#FFC107" />
          <path d="M18 27 L15 32 L24 28" fill="#FF8F00" />
          {/* Eye */}
          <circle cx="26" cy="20" r="4" fill="white" />
          <circle cx="25" cy="20" r="2" fill="black" />
          {/* Tail feathers */}
          <path d="M30 70 L25 90 L30 85 L35 90 L30 70" fill="#E53935" />
          <path d="M28 70 L20 88" stroke="#1976D2" strokeWidth="3" />
          <path d="M32 70 L40 88" stroke="#FFC107" strokeWidth="3" />
        </svg>
      </div>

      {/* Palm tree left */}
      <div className="absolute top-0 left-0 w-24 h-48 md:w-32 md:h-64">
        <svg viewBox="0 0 100 200" className="w-full h-full">
          {/* Trunk */}
          <path d="M50 200 Q55 150 50 100 Q48 80 50 60" stroke="#5D4037" strokeWidth="12" fill="none" />
          <path d="M50 200 Q55 150 50 100 Q48 80 50 60" stroke="#8D6E63" strokeWidth="8" fill="none" />
          {/* Leaves */}
          <path d="M50 60 Q20 30 -10 40" stroke="#2E7D32" strokeWidth="8" fill="none" />
          <path d="M50 60 Q30 20 10 10" stroke="#388E3C" strokeWidth="7" fill="none" />
          <path d="M50 60 Q80 30 110 40" stroke="#2E7D32" strokeWidth="8" fill="none" />
          <path d="M50 60 Q70 20 90 10" stroke="#388E3C" strokeWidth="7" fill="none" />
          <path d="M50 60 Q50 15 50 -10" stroke="#43A047" strokeWidth="6" fill="none" />
          {/* Coconuts */}
          <circle cx="45" cy="65" r="6" fill="#5D4037" />
          <circle cx="55" cy="68" r="5" fill="#4E342E" />
        </svg>
      </div>

      {/* Palm tree right */}
      <div className="absolute top-10 right-0 w-20 h-40 md:w-28 md:h-56">
        <svg viewBox="0 0 100 200" className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
          <path d="M50 200 Q55 150 50 100 Q48 80 50 60" stroke="#5D4037" strokeWidth="12" fill="none" />
          <path d="M50 200 Q55 150 50 100 Q48 80 50 60" stroke="#8D6E63" strokeWidth="8" fill="none" />
          <path d="M50 60 Q20 30 -10 40" stroke="#2E7D32" strokeWidth="8" fill="none" />
          <path d="M50 60 Q30 20 10 10" stroke="#388E3C" strokeWidth="7" fill="none" />
          <path d="M50 60 Q80 30 110 40" stroke="#2E7D32" strokeWidth="8" fill="none" />
          <path d="M50 60 Q70 20 90 10" stroke="#388E3C" strokeWidth="7" fill="none" />
        </svg>
      </div>

      {/* Tiki statue left */}
      <div className="absolute bottom-[30%] left-2 md:left-6 w-12 h-20 md:w-16 md:h-28">
        <svg viewBox="0 0 40 70" className="w-full h-full">
          <rect x="8" y="10" width="24" height="55" rx="4" fill="#5D4037" />
          <rect x="10" y="12" width="20" height="51" rx="3" fill="#6D4C41" />
          {/* Eyes */}
          <ellipse cx="15" cy="28" rx="4" ry="5" fill="#A5D6A7" />
          <ellipse cx="25" cy="28" rx="4" ry="5" fill="#A5D6A7" />
          <circle cx="15" cy="29" r="2" fill="#1B5E20" />
          <circle cx="25" cy="29" r="2" fill="#1B5E20" />
          {/* Mouth */}
          <rect x="12" y="42" width="16" height="10" rx="2" fill="#1B5E20" />
          <rect x="14" y="44" width="4" height="6" fill="#A5D6A7" />
          <rect x="22" y="44" width="4" height="6" fill="#A5D6A7" />
        </svg>
      </div>

      {/* Moai stone head right */}
      <div className="absolute bottom-[35%] right-3 md:right-8 w-10 h-16 md:w-14 md:h-24">
        <svg viewBox="0 0 35 60" className="w-full h-full">
          <path d="M5 60 L5 25 Q5 5 17 5 Q30 5 30 25 L30 60 Z" fill="#78909C" />
          <path d="M7 58 L7 26 Q7 8 17 8 Q28 8 28 26 L28 58 Z" fill="#90A4AE" />
          {/* Brow */}
          <path d="M10 22 L25 22" stroke="#546E7A" strokeWidth="3" />
          {/* Eyes */}
          <ellipse cx="13" cy="30" rx="3" ry="4" fill="#263238" />
          <ellipse cx="22" cy="30" rx="3" ry="4" fill="#263238" />
          {/* Nose */}
          <path d="M17 32 L15 42 L20 42 Z" fill="#607D8B" />
          {/* Mouth */}
          <line x1="12" y1="48" x2="23" y2="48" stroke="#455A64" strokeWidth="2" />
        </svg>
      </div>

      {/* Volcano in background */}
      <div className="absolute top-[5%] left-[20%] w-32 h-24 md:w-48 md:h-32 opacity-60">
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <path d="M0 80 L40 20 L50 25 L60 15 L70 25 L80 20 L120 80 Z" fill="#5D4037" />
          <path d="M5 80 L42 25 L50 30 L60 20 L70 30 L78 25 L115 80 Z" fill="#6D4C41" />
          {/* Lava glow */}
          <ellipse cx="60" cy="18" rx="15" ry="8" fill="#FF5722" opacity="0.7" />
          <ellipse cx="60" cy="18" rx="10" ry="5" fill="#FF9800" opacity="0.8" />
        </svg>
      </div>

      {/* Tropical flowers scattered */}
      <Flower x="5%" y="50%" color="#E91E63" size={14} />
      <Flower x="92%" y="55%" color="#9C27B0" size={12} />
      <Flower x="8%" y="75%" color="#FF5722" size={16} />
      <Flower x="88%" y="70%" color="#E91E63" size={14} />
      <Flower x="3%" y="85%" color="#9C27B0" size={12} />

      {/* Green foliage at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
        <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 60 Q20 40 40 55 Q60 30 80 50 Q100 20 120 45 Q140 25 160 50 Q180 30 200 55 Q220 20 240 50 Q260 35 280 55 Q300 25 320 50 Q340 30 360 55 Q380 40 400 60 Z" fill="#2E7D32" />
          <path d="M0 60 Q30 45 50 58 Q80 35 100 55 Q130 30 150 52 Q180 35 200 58 Q230 30 250 55 Q280 40 300 58 Q330 35 350 55 Q380 45 400 60 Z" fill="#388E3C" />
        </svg>
      </div>

      {/* Decorative leaves left */}
      <div className="absolute bottom-20 left-0 w-20 h-28 md:w-28 md:h-40">
        <svg viewBox="0 0 70 100" className="w-full h-full">
          <path d="M0 100 Q10 60 5 30 Q15 50 10 80 Z" fill="#1B5E20" />
          <path d="M5 100 Q20 50 25 20 Q30 55 20 85 Z" fill="#2E7D32" />
          <path d="M15 100 Q35 55 45 30 Q40 60 30 90 Z" fill="#388E3C" />
        </svg>
      </div>

      {/* Decorative leaves right */}
      <div className="absolute bottom-24 right-0 w-20 h-28 md:w-28 md:h-40" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 70 100" className="w-full h-full">
          <path d="M0 100 Q10 60 5 30 Q15 50 10 80 Z" fill="#1B5E20" />
          <path d="M5 100 Q20 50 25 20 Q30 55 20 85 Z" fill="#2E7D32" />
          <path d="M15 100 Q35 55 45 30 Q40 60 30 90 Z" fill="#388E3C" />
        </svg>
      </div>
    </div>
  );
}

function Flower({ x, y, color, size }: { x: string; y: string; color: string; size: number }) {
  return (
    <div 
      className="absolute"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <svg viewBox="0 0 20 20" className="w-full h-full">
        <circle cx="10" cy="4" r="4" fill={color} />
        <circle cx="16" cy="10" r="4" fill={color} />
        <circle cx="10" cy="16" r="4" fill={color} />
        <circle cx="4" cy="10" r="4" fill={color} />
        <circle cx="10" cy="10" r="3" fill="#FFEB3B" />
      </svg>
    </div>
  );
}
