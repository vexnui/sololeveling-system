'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function SplashScreen() {
  const { setShowSplash } = useGameStore();
  const [phase, setPhase] = useState<'init' | 'scanning' | 'welcome' | 'ready'>('init');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('scanning'), 800);
    const t2 = setTimeout(() => setPhase('welcome'), 2800);
    const t3 = setTimeout(() => setPhase('ready'), 4200);
    const t4 = setTimeout(() => setShowSplash(false), 5200);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 8 + 2;
      });
    }, 80);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearInterval(interval);
    };
  }, [setShowSplash]);

  const lines = [
    { phase: 'scanning', text: 'SCANNING BIOLOGICAL SIGNATURE...' },
    { phase: 'scanning', text: 'PLAYER PROFILE DETECTED' },
    { phase: 'scanning', text: 'CALIBRATING SYSTEM PARAMETERS...' },
    { phase: 'welcome', text: 'SYSTEM LINK ESTABLISHED' },
    { phase: 'ready', text: 'INITIATING QUEST PROTOCOLS...' },
  ];

  const visibleLines = lines.filter(
    (l) =>
      (l.phase === 'scanning' && (phase === 'scanning' || phase === 'welcome' || phase === 'ready')) ||
      (l.phase === 'welcome' && (phase === 'welcome' || phase === 'ready')) ||
      l.phase === phase
  );

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#0D0D0D] grid-bg overflow-hidden">
      {/* Background scan lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-x-0 h-20 opacity-5"
          style={{
            background: 'linear-gradient(transparent, #00d4ff, transparent)',
            animation: 'scanlines 3s linear infinite',
            backgroundSize: '100% 20px',
          }}
        />
      </div>

      {/* Hexagon logo */}
      <div className="relative mb-8">
        <div
          className="w-28 h-28 flex items-center justify-center"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'linear-gradient(135deg, #001133, #000820)',
            border: '2px solid #00d4ff30',
            boxShadow: '0 0 40px #00d4ff40, inset 0 0 30px #00d4ff10',
          }}
        >
          <span
            className="text-4xl font-black font-mono tracking-widest"
            style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff80' }}
          >
            SX
          </span>
        </div>
        {/* Rotating ring */}
        <div
          className="absolute inset-[-8px] rounded-full border border-dashed border-[#00d4ff20]"
          style={{ animation: 'aura-rotate 6s linear infinite' }}
        />
        <div
          className="absolute inset-[-16px] rounded-full border border-dotted border-[#9d00ff15]"
          style={{ animation: 'aura-rotate 10s linear infinite reverse' }}
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl font-black tracking-[6px] font-mono mb-1 glitch"
          style={{ color: '#ffffff', textShadow: '0 0 20px #00d4ff80' }}
        >
          SYSTEM X
        </h1>
        <p className="text-[10px] tracking-[6px] text-[#00d4ff66] font-mono uppercase">
          Real Life RPG Protocol
        </p>
      </div>

      {/* Terminal output */}
      <div
        className="w-72 bg-[#050510] border border-[#00d4ff15] rounded-lg p-4 font-mono mb-8"
        style={{ boxShadow: '0 0 20px #00d4ff10' }}
      >
        {phase === 'init' && (
          <p className="text-[11px] text-[#00d4ff] cursor">SYSTEM INITIALIZING</p>
        )}
        {visibleLines.map((line, i) => (
          <p key={i} className="text-[11px] text-[#00d4ff88] mb-0.5">
            <span className="text-[#00d4ff44]">&gt; </span>
            {line.text}
          </p>
        ))}
        {(phase === 'welcome' || phase === 'ready') && (
          <p
            className="text-base font-bold mt-2"
            style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff' }}
          >
            WELCOME, PLAYER.
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-72">
        <div className="flex justify-between mb-1.5">
          <span className="text-[9px] font-mono text-[#00d4ff66] tracking-widest">SYSTEM LOAD</span>
          <span className="text-[9px] font-mono text-[#00d4ff]">{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-1.5 bg-[#ffffff08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: 'linear-gradient(90deg, #003366, #00d4ff)',
              boxShadow: '0 0 8px #00d4ff80',
            }}
          />
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-8 text-[9px] font-mono text-[#ffffff15] tracking-widest">
        SYSTEM X v2.4.1 — CLASSIFIED
      </div>
    </div>
  );
}
