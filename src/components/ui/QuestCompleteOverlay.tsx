'use client';

import { useEffect } from 'react';

interface QuestCompleteOverlayProps {
  questTitle: string;
  xpReward: number;
  onDismiss: () => void;
}

export function QuestCompleteOverlay({ questTitle, xpReward, onDismiss }: QuestCompleteOverlayProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2800);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      <div className="relative quest-complete-anim text-center px-10 py-8 max-w-[320px] w-full">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: '0 0 60px #00ff8830, inset 0 0 40px #00ff8810',
            border: '1px solid #00ff8825',
            background: 'rgba(0, 255, 136, 0.04)',
          }}
        />

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full particle"
            style={{
              background: '#00ff88',
              boxShadow: '0 0 6px #00ff88',
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + i * 15}%`,
              '--dur': `${1.5 + Math.random()}s`,
              '--delay': `${i * 0.1}s`,
            } as React.CSSProperties}
          />
        ))}

        <div className="relative z-10">
          <div
            className="text-5xl mb-4"
            style={{
              filter: 'drop-shadow(0 0 15px #00ff88)',
              animation: 'aura-pulse 1.5s ease-in-out infinite',
            }}
          >
            ✓
          </div>

          <div
            className="text-[10px] tracking-[5px] font-mono mb-1 uppercase"
            style={{ color: '#00ff8866' }}
          >
            SYSTEM NOTIFICATION
          </div>
          <div
            className="text-2xl font-black font-mono tracking-[3px] mb-2"
            style={{ color: '#00ff88', textShadow: '0 0 20px #00ff8880' }}
          >
            QUEST COMPLETE
          </div>

          <div
            className="text-sm font-mono mb-3 leading-snug"
            style={{ color: '#e0e0ff88' }}
          >
            {questTitle}
          </div>

          <div
            className="inline-block px-5 py-2 rounded-full font-mono font-black text-lg"
            style={{
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid #00ff8840',
              color: '#00ff88',
              textShadow: '0 0 15px #00ff88',
              boxShadow: '0 0 20px #00ff8830',
            }}
          >
            +{xpReward} XP
          </div>

          <div className="mt-4 text-[9px] text-[#8888aa] font-mono tracking-wider">
            TAP TO CONTINUE
          </div>
        </div>
      </div>
    </div>
  );
}
