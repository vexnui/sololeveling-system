'use client';

import { useState, useEffect } from 'react';
import { createUserProfile } from '@/lib/user_service';
import { seedDefaultQuestsForUser } from '@/lib/quest_service';

interface OnboardingScreenProps {
  userId: string;
  userEmail: string;
  onComplete: (username: string) => Promise<void>;
}

type Phase = 'detect' | 'form' | 'registering' | 'done';

const DETECT_LINES = [
  { text: 'ANOMALY DETECTED IN SYSTEM DATABASE...', delay: 0 },
  { text: 'NEW ENTITY IDENTIFIED.', delay: 700 },
  { text: 'BIOLOGICAL SCAN COMPLETE.', delay: 1400 },
  { text: 'NO PLAYER PROFILE FOUND.', delay: 2100 },
  { text: 'INITIATING PLAYER AWAKENING PROTOCOL...', delay: 2700 },
];

export function OnboardingScreen({ userId, userEmail, onComplete }: OnboardingScreenProps) {
  const [phase, setPhase] = useState<Phase>('detect');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [registeredName, setRegisteredName] = useState('');

  // Detect phase animation
  useEffect(() => {
    if (phase !== 'detect') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    DETECT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    // Progress bar
    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return Math.min(100, p + Math.random() * 8 + 3);
      });
    }, 80);

    // Transition to form
    timers.push(setTimeout(() => setPhase('form'), 3400));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [phase]);

  async function handleAwaken(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const clean = username.trim().toUpperCase().replace(/\s+/g, '_');
    if (!clean || clean.length < 3) {
      setError('DESIGNATION TOO SHORT. MINIMUM 3 CHARACTERS REQUIRED.');
      return;
    }
    if (clean.length > 20) {
      setError('DESIGNATION TOO LONG. MAXIMUM 20 CHARACTERS ALLOWED.');
      return;
    }
    if (!/^[A-Z0-9_]+$/.test(clean)) {
      setError('INVALID CHARACTERS. USE LETTERS, NUMBERS, UNDERSCORES ONLY.');
      return;
    }

    setPhase('registering');
    setRegisteredName(clean);

    const profile = await createUserProfile(userId, clean, userEmail);
    if (!profile) {
      setError('SYSTEM ERROR. REGISTRATION FAILED. RETRY REQUIRED.');
      setPhase('form');
      return;
    }

    await seedDefaultQuestsForUser(userId);
    setPhase('done');
    setTimeout(() => onComplete(clean), 2500);
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden scanlines-overlay">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Scanline sweep */}
      <div className="scanline-sweep" />

      {/* Ambient rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full border border-[#9d00ff05]"
          style={{ animation: 'aura-rotate 35s linear infinite' }} />
        <div className="absolute w-[520px] h-[520px] rounded-full border border-[#00d4ff06]"
          style={{ animation: 'aura-rotate 22s linear infinite reverse' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-[#9d00ff07]"
          style={{ animation: 'aura-rotate 15s linear infinite' }} />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#9d00ff25]" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#9d00ff25]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00d4ff20]" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00d4ff20]" />
      </div>

      <div className="relative w-full max-w-[390px] px-5 z-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div
              className="w-20 h-20 hex-clip flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0a0030, #050018)',
                boxShadow: '0 0 40px #9d00ff40, inset 0 0 20px #9d00ff10',
              }}
            >
              <span className="text-2xl font-black font-mono"
                style={{ color: '#9d00ff', textShadow: '0 0 20px #9d00ff' }}>SX</span>
            </div>
            <div className="absolute inset-[-8px] rounded-full border border-[#9d00ff25]"
              style={{ animation: 'aura-rotate 10s linear infinite' }} />
          </div>
          <h1 className="text-3xl font-black tracking-[6px] font-mono glitch"
            style={{ color: '#ffffff', textShadow: '0 0 20px #9d00ff60' }}>
            SYSTEM X
          </h1>
        </div>

        {/* ── DETECT PHASE ── */}
        {phase === 'detect' && (
          <div className="rounded-xl border border-[#9d00ff18] bg-[#050510] p-5 font-mono fade-in-scale"
            style={{ boxShadow: '0 0 30px #9d00ff10' }}>
            <div className="text-[10px] text-[#9d00ff77] tracking-[4px] mb-4 text-center flicker">
              ◈ SYSTEM SCAN IN PROGRESS ◈
            </div>

            <div className="space-y-1.5 mb-5 min-h-[90px]">
              {DETECT_LINES.slice(0, visibleLines).map((line, i) => (
                <p key={i}
                  className="text-[11px] leading-snug text-reveal"
                  style={{
                    color: i === DETECT_LINES.length - 1 ? '#9d00ff' : '#9d00ff77',
                    animationDelay: `${i * 0.05}s`,
                  }}>
                  <span className="text-[#9d00ff33]">&gt; </span>
                  {line.text}
                </p>
              ))}
              {visibleLines < DETECT_LINES.length && (
                <p className="text-[11px] text-[#9d00ff] cursor">
                  <span className="text-[#9d00ff33]">&gt; </span>
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[8px] tracking-widest text-[#9d00ff44]">BIOMETRIC SCAN</span>
                <span className="text-[8px] text-[#9d00ff]">{Math.min(100, Math.round(scanProgress))}%</span>
              </div>
              <div className="h-1.5 bg-[#ffffff05] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min(100, scanProgress)}%`,
                    background: 'linear-gradient(90deg, #1a0050, #9d00ff)',
                    boxShadow: '0 0 8px #9d00ff80',
                  }} />
              </div>
            </div>
          </div>
        )}

        {/* ── FORM PHASE ── */}
        {phase === 'form' && (
          <div className="rounded-xl border border-[#9d00ff22] glass-panel p-6 fade-in-scale"
            style={{ boxShadow: '0 0 40px #9d00ff12, 0 0 80px #9d00ff06' }}>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-[9px] tracking-[5px] font-mono text-[#9d00ff44] mb-2">
                [ NEW PLAYER DETECTED ]
              </div>
              <h2 className="text-xl font-black font-mono tracking-[3px]"
                style={{ color: '#9d00ff', textShadow: '0 0 20px #9d00ff60' }}>
                ENTER USERNAME TO AWAKEN
              </h2>
              <p className="text-[10px] tracking-[2px] text-[#8888aa] font-mono mt-1">
                Your designation is permanent. Choose wisely.
              </p>
            </div>

            <form onSubmit={handleAwaken} className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Player Designation
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="SHADOW_HUNTER"
                  maxLength={20}
                  className="w-full bg-[#030308] border border-[#9d00ff25] rounded-lg px-3 py-3 text-[#e0e0ff] font-mono text-sm tracking-wider uppercase placeholder:text-[#ffffff10] focus:outline-none focus:border-[#9d00ff80] transition-all duration-300"
                  style={{ boxShadow: 'inset 0 0 15px #9d00ff05' }}
                  autoFocus
                />
              </div>

              {/* Email read-only */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; System ID (Email)
                </label>
                <div className="w-full bg-[#030308] border border-[#ffffff08] rounded-lg px-3 py-3 text-[#ffffff25] font-mono text-sm tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
                  {userEmail}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg border border-[#ff003c30] bg-[#ff003c09] failure-shake">
                  <p className="text-[10px] font-mono tracking-wider text-[#ff6666]">⚠ {error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-mono font-black tracking-[4px] text-base uppercase transition-all duration-300 relative overflow-hidden active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #12003a, #280080)',
                  color: '#9d00ff',
                  border: '1px solid #9d00ff55',
                  boxShadow: '0 0 30px #9d00ff35, inset 0 0 20px #9d00ff10',
                }}
              >
                <div className="absolute inset-0 shimmer opacity-20" />
                <span>◈ AWAKEN PLAYER ◈</span>
              </button>
            </form>
          </div>
        )}

        {/* ── REGISTERING PHASE ── */}
        {phase === 'registering' && (
          <div className="rounded-xl border border-[#9d00ff35] bg-[#0a0022] p-8 text-center fade-in-scale"
            style={{ boxShadow: '0 0 50px #9d00ff20' }}>
            <div className="text-5xl mb-5 flicker" style={{ filter: 'drop-shadow(0 0 20px #9d00ff)' }}>⚡</div>
            <div className="text-lg font-black font-mono tracking-[4px] mb-2"
              style={{ color: '#9d00ff', textShadow: '0 0 25px #9d00ff' }}>
              AWAKENING PLAYER...
            </div>
            <p className="text-[10px] tracking-[3px] text-[#9d00ff77] font-mono cursor">
              WRITING TO SYSTEM DATABASE
            </p>
            {/* Animated dots */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#9d00ff]"
                  style={{
                    animation: `statusBlink 1.2s ease-in-out ${i * 0.3}s infinite`,
                    boxShadow: '0 0 8px #9d00ff',
                  }} />
              ))}
            </div>
          </div>
        )}

        {/* ── DONE PHASE ── */}
        {phase === 'done' && (
          <div className="rounded-xl border border-[#00ff8835] bg-[#001a08] p-8 text-center level-up-popup"
            style={{ boxShadow: '0 0 60px #00ff8825' }}>
            {/* Rays */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 w-px"
                  style={{
                    height: '120%',
                    background: 'linear-gradient(to top, #00ff8820, transparent)',
                    transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                    transformOrigin: 'bottom center',
                    opacity: 0.4,
                    animation: 'levelUpRays 2s ease-out forwards',
                  }} />
              ))}
            </div>

            <div className="text-5xl mb-4"
              style={{ filter: 'drop-shadow(0 0 20px #00ff88)', animation: 'aura-pulse 2s ease-in-out infinite' }}>
              ✦
            </div>
            <div className="text-[10px] tracking-[5px] font-mono text-[#00ff8866] mb-2 uppercase">
              System Notification
            </div>
            <div className="text-2xl font-black font-mono tracking-[3px] mb-3"
              style={{ color: '#00ff88', textShadow: '0 0 25px #00ff8880' }}>
              PLAYER REGISTERED
            </div>
            <div className="text-3xl font-black font-mono tracking-widest mb-3"
              style={{ color: '#ffffff', textShadow: '0 0 20px #ffffff40' }}>
              {registeredName}
            </div>
            <p className="text-[10px] tracking-[2px] text-[#00ff8877] font-mono">
              WELCOME TO SYSTEM X.<br />YOUR JOURNEY AS A PLAYER BEGINS NOW.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
