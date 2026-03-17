'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

type BootPhase = 'init' | 'boot' | 'check' | 'ready';

const BOOT_LINES = [
  { text: 'SYSTEM X KERNEL v3.0.0 LOADED', phase: 'boot' as BootPhase },
  { text: 'HARDWARE INTERFACE: ONLINE', phase: 'boot' as BootPhase },
  { text: 'NEURAL LINK: ESTABLISHING...', phase: 'boot' as BootPhase },
  { text: 'CHECKING PLAYER DATA...', phase: 'check' as BootPhase },
  { text: 'DATABASE CONNECTION: ACTIVE', phase: 'check' as BootPhase },
  { text: 'AUTHENTICATION MODULE: READY', phase: 'check' as BootPhase },
  { text: 'ALL SYSTEMS NOMINAL. WELCOME, PLAYER.', phase: 'ready' as BootPhase },
];

export function SplashScreen() {
  const { setShowSplash } = useGameStore();
  const [phase, setPhase] = useState<BootPhase>('init');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase progression
    timers.push(setTimeout(() => { setPhase('boot'); setTargetProgress(30); }, 300));
    timers.push(setTimeout(() => { setPhase('check'); setTargetProgress(70); }, 1400));
    timers.push(setTimeout(() => { setPhase('ready'); setTargetProgress(100); }, 2200));
    timers.push(setTimeout(() => setShowSplash(false), 3200));

    // Reveal lines with stagger
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 400 + i * 280));
    });

    return () => timers.forEach(clearTimeout);
  }, [setShowSplash]);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const diff = targetProgress - p;
        if (Math.abs(diff) < 0.5) return targetProgress;
        return p + diff * 0.08 + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [targetProgress]);

  const linePhaseOrder: BootPhase[] = ['init', 'boot', 'check', 'ready'];
  const currentPhaseIdx = linePhaseOrder.indexOf(phase);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden scanlines-overlay">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Scanline sweep */}
      <div className="scanline-sweep" />

      {/* Ambient rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#00d4ff07]"
          style={{ animation: 'aura-rotate 25s linear infinite' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-[#9d00ff07]"
          style={{ animation: 'aura-rotate 18s linear infinite reverse' }} />
        {/* Top corners */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#00d4ff30]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#00d4ff30]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#9d00ff25]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#9d00ff25]" />
      </div>

      <div className="relative w-full max-w-[360px] px-6 z-10">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div
              className="w-28 h-28 hex-clip flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #001a44, #000d22)',
                boxShadow: '0 0 60px #00d4ff40, inset 0 0 40px #00d4ff15',
              }}
            >
              <span
                className="text-4xl font-black font-mono tracking-widest"
                style={{
                  color: '#00d4ff',
                  textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff60, 0 0 80px #00d4ff30',
                }}
              >
                SX
              </span>
            </div>
            <div className="absolute inset-[-10px] rounded-full border border-dashed border-[#00d4ff20]"
              style={{ animation: 'aura-rotate 8s linear infinite' }} />
            <div className="absolute inset-[-22px] rounded-full border border-dotted border-[#9d00ff15]"
              style={{ animation: 'aura-rotate 14s linear infinite reverse' }} />
          </div>

          <h1
            className="text-5xl font-black tracking-[8px] font-mono"
            style={{
              color: '#ffffff',
              textShadow: '0 0 20px #00d4ff80, 0 0 40px #00d4ff40',
              animation: phase === 'ready' ? 'glitch 3s infinite' : undefined,
            }}
          >
            SYSTEM X
          </h1>
          <p className="text-[9px] tracking-[6px] font-mono mt-1 text-[#00d4ff44] uppercase">
            Real Life RPG Protocol
          </p>
        </div>

        {/* ── Terminal boot output ── */}
        <div
          className="w-full bg-[#030308] border border-[#00d4ff12] rounded-xl p-4 mb-6 font-mono"
          style={{ boxShadow: '0 0 25px #00d4ff08, inset 0 0 20px #00000080' }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ffffff06]">
            <div className="w-2 h-2 rounded-full bg-[#ff003c]" style={{ boxShadow: '0 0 4px #ff003c' }} />
            <div className="w-2 h-2 rounded-full bg-[#ffcc00]" style={{ boxShadow: '0 0 4px #ffcc00' }} />
            <div className="w-2 h-2 rounded-full bg-[#00ff88]" style={{ boxShadow: '0 0 4px #00ff88' }} />
            <span className="text-[8px] text-[#ffffff20] tracking-widest ml-2">SYSTEM_BOOT.SH</span>
          </div>

          {/* Lines */}
          <div className="space-y-1 min-h-[130px]">
            {phase === 'init' && (
              <p className="text-[11px] text-[#00d4ff] cursor">
                <span className="text-[#00d4ff33]">$ </span>
              </p>
            )}
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
              const linePhaseIdx = linePhaseOrder.indexOf(line.phase);
              const isActive = linePhaseIdx === currentPhaseIdx;
              const isDone = linePhaseIdx < currentPhaseIdx;
              return (
                <p key={i}
                  className="text-[11px] leading-snug text-reveal"
                  style={{
                    color: isDone ? '#00d4ff44'
                      : line.phase === 'ready' ? '#00ff88'
                      : isActive ? '#00d4ff'
                      : '#00d4ff88',
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  <span className="text-[#00d4ff22]">$ </span>
                  {isDone && <span className="text-[#00ff8866]">[OK] </span>}
                  {line.text}
                </p>
              );
            })}
            {visibleLines < BOOT_LINES.length && (
              <p className="text-[11px] text-[#00d4ff] cursor">
                <span className="text-[#00d4ff22]">$ </span>
              </p>
            )}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div className="flex justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] status-dot"
                style={{ boxShadow: '0 0 6px #00d4ff' }} />
              <span className="text-[9px] font-mono text-[#00d4ff66] tracking-widest">
                {phase === 'init' ? 'INITIALIZING' :
                  phase === 'boot' ? 'SYSTEM INITIALIZING...' :
                  phase === 'check' ? 'CHECKING PLAYER DATA...' :
                  'SYSTEM READY'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#00d4ff]">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[#ffffff06] rounded-full overflow-hidden border border-[#00d4ff10]">
            <div
              className="h-full rounded-full relative overflow-hidden transition-none"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: 'linear-gradient(90deg, #003366, #00d4ff, #00ffea)',
                boxShadow: '0 0 10px #00d4ff60',
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>

        {/* Version */}
        <div className="text-center mt-6">
          <p className="text-[9px] font-mono text-[#ffffff10] tracking-widest flicker">
            SYSTEM X v3.0.0 — CLASSIFIED ◈ BUILD 20260317
          </p>
        </div>
      </div>
    </div>
  );
}
