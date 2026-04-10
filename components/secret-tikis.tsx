"use client";

import type { Token, Player } from "@/lib/game-types";
import { SCORING_TABLE } from "@/lib/game-types";

interface SecretTikisProps {
  player: Player;
  stack: Token[];
  isCurrentPlayer: boolean;
  showAll?: boolean;
}

export function SecretTikis({ player, stack, isCurrentPlayer, showAll = false }: SecretTikisProps) {
  // Find the player's secret tikis in the stack
  const secretTikiInfo = player.secretTikis.map((tokenId) => {
    const stackIndex = stack.findIndex((t) => t.id === tokenId);
    const token = stack.find((t) => t.id === tokenId);
    return {
      tokenId,
      token,
      position: stackIndex >= 0 ? stackIndex + 1 : null,
      points: stackIndex >= 0 ? SCORING_TABLE[stackIndex + 1] || 0 : 0,
    };
  });

  const shouldReveal = isCurrentPlayer || showAll;

  return (
    <div 
      className={`rounded-xl p-3 transition-all ${isCurrentPlayer ? 'ring-2 ring-white shadow-lg' : ''}`}
      style={{ 
        backgroundColor: isCurrentPlayer ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm" style={{ color: '#F0FDFA' }}>
          {player.name}
          {isCurrentPlayer && (
            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-white/20">
              Your Turn
            </span>
          )}
        </span>
        {showAll && (
          <span className="font-bold text-lg" style={{ color: '#FFEB3B' }}>
            {player.score} pts
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        {secretTikiInfo.map(({ tokenId, token, position, points }) => (
          <div key={tokenId} className="flex flex-col items-center">
            {shouldReveal && token ? (
              <>
                <div
                  className="w-8 h-12 rounded-t-md rounded-b-sm flex items-center justify-center relative"
                  style={{
                    backgroundColor: token.color,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Mini tiki face */}
                  <div className="flex flex-col items-center">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1.5 bg-white/80 rounded-sm" />
                      <div className="w-1 h-1.5 bg-white/80 rounded-sm" />
                    </div>
                    <div className="w-3 h-1 bg-white/80 rounded-sm mt-0.5" />
                  </div>
                </div>
                {position && (
                  <div 
                    className="text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#F0FDFA' }}
                  >
                    #{position} ({points}pt)
                  </div>
                )}
                {!position && (
                  <div 
                    className="text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(229,57,53,0.5)', color: '#F0FDFA' }}
                  >
                    TOAST!
                  </div>
                )}
              </>
            ) : (
              <div
                className="w-8 h-12 rounded-t-md rounded-b-sm flex items-center justify-center"
                style={{
                  backgroundColor: '#5D4037',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <span className="text-lg font-bold" style={{ color: '#8B7355' }}>?</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
