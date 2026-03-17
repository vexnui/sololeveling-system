'use client';

import { useState, useEffect } from 'react';
import { createUserProfile } from '@/lib/user_service';
import { seedDefaultQuestsForUser } from '@/lib/quest_service';

interface OnboardingScreenProps {
  userId: string;
  userEmail: string;
  onComplete: (username: string) => void;
}

type Phase = 'detect' | 'form' | 'registering' | 'done';

export function OnboardingScreen({ userId, userEmail, onComplete }: OnboardingScreenProps) {
  const [phase, setPhase] = useState<Phase>('detect');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const detectLines = [
    'SCANNING BIOLOGICAL SIGNATURE...',
    'NEW ENTITY DETECTED.',
    'SYSTEM INITIATING REGISTRATION PROTOCOL...',
    'AWAITING PLAYER DESIGNATION...',
  ];

  useEffect(() => {
    if (phase !== 'detect') return;
    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      if (lineIdx < detectLines.length) {
        setTerminalLines((prev) => [...prev, detectLines[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(lineInterval);
        setTimeout(() => setPhase('form'), 600);
      }
    }, 600);

    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return Math.min(100, p + Math.random() * 12 + 4);
      });
    }, 100);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  async function handleAwaken(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toUpperCase().replace(/\s+/g, '_');
    if (!cleanUsername || cleanUsername.length < 3) {
      setError('DESIGNATION TOO SHORT. MINIMUM 3 CHARACTERS.');
      return;
    }
    if (cleanUsername.length > 20) {
      setError('DESIGNATION TOO LONG. MAXIMUM 20 CHARACTERS.');
      return;
    }

    setPhase('registering');

    const profile = await createUserProfile(userId, cleanUsername, userEmail);
    if (!profile) {
      setError('REGISTRATION FAILED. SYSTEM ERROR. RETRY.');
      setPhase('form');
      return;
    }

    await seedDefaultQuestsForUser(userId);

    setPhase('done');
    setTimeout(() => onComplete(cleanUsername), 2000);
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0D0D0D] grid-bg overflow-hidden">
      {/* Ambient rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#00d4ff06]" style={{ animation: 'aura-rotate 25s linear infinite' }} />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#9d00ff06]" style={{ animation: 'aura-rotate 18s linear infinite reverse' }} />
      </div>

      <div className="relative w-full max-w-[380px] px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-16 h-16 flex items-center justify-center mb-3"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(135deg, #001133, #000820)',
              boxShadow: '0 0 40px #00d4ff40, inset 0 0 20px #00d4ff10',
            }}
          >
            <span className="text-xl font-black font-mono" style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff' }}>SX</span>
          </div>
          <h2 className="text-2xl font-black tracking-[4px] font-mono" style={{ color: '#ffffff', textShadow: '0 0 15px #00d4ff60' }}>
            SYSTEM X
          </h2>
        </div>

        {/* Detect Phase — Terminal */}
        {(phase === 'detect') && (
          <div
            className="rounded-lg border border-[#00d4ff18] bg-[#050510] p-5 font-mono"
            style={{ boxShadow: '0 0 25px #00d4ff10' }}
          >
            <div className="text-[10px] text-[#00d4ff88] tracking-[4px] mb-4 text-center">
              ◈ SYSTEM DETECTING NEW PLAYER ◈
            </div>
            <div className="space-y-1 mb-4 min-h-[80px]">
              {terminalLines.map((line, i) => (
                <p key={i} className="text-[11px] text-[#00d4ff77]">
                  <span className="text-[#00d4ff33]">&gt; </span>
                  {line}
                </p>
              ))}
              {terminalLines.length < detectLines.length && (
                <p className="text-[11px] text-[#00d4ff] cursor">
                  <span className="text-[#00d4ff33]">&gt; </span>
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[8px] font-mono text-[#00d4ff44] tracking-widest">SCAN PROGRESS</span>
                <span className="text-[8px] font-mono text-[#00d4ff]">{Math.min(100, Math.round(scanProgress))}%</span>
              </div>
              <div className="h-1 bg-[#ffffff06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min(100, scanProgress)}%`,
                    background: 'linear-gradient(90deg, #003366, #00d4ff)',
                    boxShadow: '0 0 8px #00d4ff80',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Phase */}
        {(phase === 'form') && (
          <div
            className="rounded-lg border border-[#00d4ff18] bg-[#0a0a14] p-6"
            style={{ boxShadow: '0 0 30px #00d4ff10, inset 0 0 20px #00d4ff05' }}
          >
            <div className="text-center mb-5">
              <div
                className="text-base font-black font-mono tracking-[3px] mb-1"
                style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff80' }}
              >
                NEW PLAYER DETECTED
              </div>
              <p className="text-[9px] tracking-[2px] text-[#8888aa] font-mono">
                DESIGNATE YOUR PLAYER IDENTITY TO BEGIN
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
                  className="w-full bg-[#050510] border border-[#00d4ff20] rounded px-3 py-2.5 text-[#e0e0ff] font-mono text-sm tracking-wider uppercase placeholder:text-[#ffffff15] focus:outline-none focus:border-[#00d4ff60] transition-colors"
                  style={{ boxShadow: 'inset 0 0 10px #00d4ff05' }}
                  autoFocus
                />
              </div>

              {/* Email (read-only, pre-filled) */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Linked Email
                </label>
                <div
                  className="w-full bg-[#050510] border border-[#ffffff08] rounded px-3 py-2.5 text-[#ffffff33] font-mono text-sm tracking-wider"
                >
                  {userEmail}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded border border-[#ff003c30] bg-[#ff003c08]">
                  <p className="text-[10px] font-mono text-[#ff6666] tracking-wider">⚠ {error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded font-mono font-black tracking-[4px] text-sm uppercase transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0a0030, #1a0060)',
                  color: '#9d00ff',
                  border: '1px solid #9d00ff50',
                  boxShadow: '0 0 25px #9d00ff30, inset 0 0 15px #9d00ff10',
                }}
              >
                ◈ AWAKEN PLAYER ◈
              </button>
            </form>
          </div>
        )}

        {/* Registering Phase */}
        {phase === 'registering' && (
          <div
            className="rounded-lg border border-[#9d00ff30] bg-[#0a0a14] p-6 text-center"
            style={{ boxShadow: '0 0 30px #9d00ff15' }}
          >
            <div className="text-4xl mb-4">⚡</div>
            <div
              className="text-base font-black font-mono tracking-[3px] mb-2"
              style={{ color: '#9d00ff', textShadow: '0 0 20px #9d00ff' }}
            >
              AWAKENING PLAYER...
            </div>
            <p className="text-[10px] tracking-[2px] text-[#8888aa] font-mono cursor">
              REGISTERING IN SYSTEM DATABASE
            </p>
          </div>
        )}

        {/* Done Phase */}
        {phase === 'done' && (
          <div
            className="rounded-lg border border-[#00ff8830] bg-[#0a0a14] p-6 text-center level-up-popup"
            style={{ boxShadow: '0 0 40px #00ff8820' }}
          >
            <div className="text-4xl mb-4">✦</div>
            <div
              className="text-base font-black font-mono tracking-[3px] mb-2"
              style={{ color: '#00ff88', textShadow: '0 0 20px #00ff8880' }}
            >
              PLAYER REGISTERED
            </div>
            <div
              className="text-xl font-black font-mono tracking-widest mb-2"
              style={{ color: '#ffffff', textShadow: '0 0 15px #ffffff40' }}
            >
              {username.trim().toUpperCase().replace(/\s+/g, '_')}
            </div>
            <p className="text-[10px] tracking-[2px] text-[#00ff8888] font-mono">
              WELCOME TO SYSTEM X. YOUR JOURNEY BEGINS NOW.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
