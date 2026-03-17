'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export function LevelUpPopup() {
  const { levelUpVisible, newLevel, setLevelUpVisible } = useGameStore();

  useEffect(() => {
    if (levelUpVisible) {
      const t = setTimeout(() => setLevelUpVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [levelUpVisible, setLevelUpVisible]);

  if (!levelUpVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={() => setLevelUpVisible(false)}
    >
      <div className="level-up-popup text-center px-8 py-10">
        <div className="text-6xl mb-4" style={{ filter: 'drop-shadow(0 0 20px #9d00ff)' }}>⬆</div>
        <div
          className="text-[11px] tracking-[4px] font-mono mb-2 uppercase"
          style={{ color: '#9d00ff', textShadow: '0 0 15px #9d00ff' }}
        >
          System Notification
        </div>
        <div
          className="text-5xl font-black tracking-widest font-mono mb-3"
          style={{ color: '#ffffff', textShadow: '0 0 30px #9d00ff, 0 0 60px #9d00ff80' }}
        >
          LEVEL UP
        </div>
        <div
          className="text-2xl font-mono font-bold"
          style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff' }}
        >
          LVL {newLevel}
        </div>
        <div className="mt-4 text-[11px] text-[#8888aa] font-mono tracking-wider">
          TAP TO CONTINUE
        </div>

        {/* Rays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-px opacity-20"
              style={{
                height: '60%',
                background: 'linear-gradient(to top, #9d00ff, transparent)',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
