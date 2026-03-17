'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import { RANK_COLORS, getRankForLevel, getAuraForLevel } from '@/lib/gameData';

export function LevelUpPopup() {
  const { levelUpVisible, newLevel, setLevelUpVisible } = useGameStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (levelUpVisible) {
      const t1 = setTimeout(() => setShowContent(true), 100);
      const t2 = setTimeout(() => setLevelUpVisible(false), 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setShowContent(false);
    }
  }, [levelUpVisible, setLevelUpVisible]);

  if (!levelUpVisible) return null;

  const newRank = getRankForLevel(newLevel);
  const newAura = getAuraForLevel(newLevel);
  const rankColor = RANK_COLORS[newRank] || '#9d00ff';

  const auraColors: Record<string, string> = {
    white: '#ffffff', blue: '#00d4ff', purple: '#9d00ff', red: '#ff003c', gold: '#ffcc00',
  };
  const auraColor = auraColors[newAura] || '#9d00ff';

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
      onClick={() => setLevelUpVisible(false)}
    >
      {/* Background glow pulse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${rankColor}08 0%, transparent 70%)`,
          animation: 'pulse-purple 2s ease-in-out infinite',
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(157,0,255,1) 3px, rgba(157,0,255,1) 6px)',
        }}
      />

      {showContent && (
        <div className="relative level-up-popup text-center px-12 py-10 max-w-[340px] w-full">

          {/* Rays burst */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-px level-up-rays"
                style={{
                  height: '80%',
                  background: `linear-gradient(to top, ${rankColor}40, transparent)`,
                  transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
                  transformOrigin: 'bottom center',
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>

          {/* Glow border */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `0 0 80px ${rankColor}30, inset 0 0 60px ${rankColor}10`,
              border: `1px solid ${rankColor}25`,
              background: `rgba(${rankColor === '#9d00ff' ? '157,0,255' : '0,212,255'}, 0.04)`,
            }}
          />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full particle"
              style={{
                background: rankColor,
                boxShadow: `0 0 6px ${rankColor}`,
                top: `${15 + Math.random() * 70}%`,
                left: `${5 + i * 12}%`,
                '--dur': `${1.5 + Math.random() * 1.5}s`,
                '--delay': `${i * 0.15}s`,
              } as React.CSSProperties}
            />
          ))}

          <div className="relative z-10">
            {/* Up arrow icon */}
            <div
              className="text-7xl mb-5"
              style={{
                filter: `drop-shadow(0 0 25px ${rankColor})`,
                animation: 'aura-pulse 1.8s ease-in-out infinite',
              }}
            >
              ⬆
            </div>

            <div
              className="text-[10px] tracking-[6px] font-mono mb-3 uppercase"
              style={{ color: `${rankColor}88` }}
            >
              ◈ System Notification ◈
            </div>

            <div
              className="text-6xl font-black tracking-[4px] font-mono mb-3"
              style={{
                color: '#ffffff',
                textShadow: `0 0 30px ${rankColor}, 0 0 60px ${rankColor}80, 0 0 100px ${rankColor}40`,
              }}
            >
              LEVEL UP
            </div>

            <div
              className="text-3xl font-mono font-black mb-4"
              style={{
                color: rankColor,
                textShadow: `0 0 20px ${rankColor}`,
              }}
            >
              LVL {newLevel}
            </div>

            {/* Rank + Aura row */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span
                className="px-3 py-1 rounded font-mono font-bold text-sm tracking-widest"
                style={{
                  color: rankColor,
                  borderColor: `${rankColor}55`,
                  background: `${rankColor}15`,
                  border: `1px solid ${rankColor}55`,
                  boxShadow: `0 0 10px ${rankColor}30`,
                  textShadow: `0 0 10px ${rankColor}`,
                }}
              >
                [{newRank}]
              </span>
              <span
                className="text-[11px] font-mono tracking-widest uppercase"
                style={{ color: auraColor, textShadow: `0 0 10px ${auraColor}` }}
              >
                {newAura} AURA
              </span>
            </div>

            <p
              className="text-[11px] font-mono italic"
              style={{ color: `${rankColor}66` }}
            >
              &ldquo;The system acknowledges your ascension.&rdquo;
            </p>

            <div className="mt-5 text-[9px] text-[#8888aa] font-mono tracking-widest">
              TAP TO CONTINUE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
