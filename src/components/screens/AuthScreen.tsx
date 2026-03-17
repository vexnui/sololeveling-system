'use client';

import { useState, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth_service';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const SCAN_LINES = [
  'INITIALIZING AUTHENTICATION PROTOCOL...',
  'SCANNING BIOMETRIC SIGNATURE...',
  'AWAITING PLAYER CREDENTIALS...',
];

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [scanLine, setScanLine] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Cycle through scan lines then reveal form
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setScanLine(1), 400));
    timers.push(setTimeout(() => setScanLine(2), 900));
    timers.push(setTimeout(() => setScanLine(3), 1400));
    timers.push(setTimeout(() => setShowForm(true), 1800));
    return () => timers.forEach(clearTimeout);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('ALL FIELDS REQUIRED. THE SYSTEM DEMANDS COMPLETE INPUT.');
      return;
    }
    if (password.length < 6) {
      setError('ACCESS CODE TOO WEAK. MINIMUM 6 CHARACTERS REQUIRED.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: authError } = await signUpWithEmail(email.trim(), password);
        if (authError) {
          setError(authError.message.toUpperCase());
        } else {
          setSuccessMsg('REGISTRATION COMPLETE. INITIATING PLAYER AWAKENING...');
          setTimeout(() => onAuthSuccess(), 1500);
        }
      } else {
        const { error: authError } = await signInWithEmail(email.trim(), password);
        if (authError) {
          setError(authError.message.toUpperCase());
        } else {
          setSuccessMsg('IDENTITY CONFIRMED. WELCOME BACK, PLAYER.');
          setTimeout(() => onAuthSuccess(), 900);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden scanlines-overlay">

      {/* ── Grid bg ── */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* ── Scanline sweep ── */}
      <div className="scanline-sweep" />

      {/* ── Ambient rings ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#00d4ff06]"
          style={{ animation: 'aura-rotate 30s linear infinite' }} />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-[#9d00ff07]"
          style={{ animation: 'aura-rotate 20s linear infinite reverse' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-[#00d4ff08]"
          style={{ animation: 'aura-rotate 12s linear infinite' }} />
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#00d4ff30]" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#00d4ff30]" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#9d00ff30]" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#9d00ff30]" />
      </div>

      <div className="relative w-full max-w-[390px] px-5 z-10">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-7">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 hex-clip flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #001a44, #000d22)',
                boxShadow: '0 0 50px #00d4ff50, inset 0 0 30px #00d4ff15',
              }}
            >
              <span
                className="text-3xl font-black font-mono tracking-widest glitch-heavy"
                style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff60' }}
              >
                SX
              </span>
            </div>
            {/* Orbital rings */}
            <div className="absolute inset-[-10px] rounded-full border border-dashed border-[#00d4ff20]"
              style={{ animation: 'aura-rotate 8s linear infinite' }} />
            <div className="absolute inset-[-22px] rounded-full border border-dotted border-[#9d00ff15]"
              style={{ animation: 'aura-rotate 14s linear infinite reverse' }} />
            {/* Pulsing dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00d4ff] status-dot"
              style={{ boxShadow: '0 0 8px #00d4ff' }} />
          </div>

          <h1
            className="text-5xl font-black tracking-[8px] font-mono glitch mb-1"
            style={{ color: '#ffffff', textShadow: '0 0 20px #00d4ff80, 0 0 40px #00d4ff30' }}
          >
            SYSTEM X
          </h1>
          <div className="text-[9px] tracking-[5px] font-mono text-[#00d4ff44] uppercase">
            REAL LIFE RPG PROTOCOL
          </div>
          {/* Horizon line */}
          <div className="w-48 h-px mt-3 bg-gradient-to-r from-transparent via-[#00d4ff40] to-transparent horizon-scan" />
        </div>

        {/* ── Terminal scan lines ── */}
        <div
          className="mb-5 px-4 py-3 rounded border border-[#00d4ff12] bg-[#050510] font-mono overflow-hidden"
          style={{ boxShadow: '0 0 20px #00d4ff08' }}
        >
          {SCAN_LINES.slice(0, scanLine).map((line, i) => (
            <p key={i} className="text-[10px] text-[#00d4ff66] mb-0.5 text-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="text-[#00d4ff30]">&gt;&gt; </span>{line}
            </p>
          ))}
          {scanLine < SCAN_LINES.length && (
            <p className="text-[10px] text-[#00d4ff] cursor">
              <span className="text-[#00d4ff30]">&gt;&gt; </span>
            </p>
          )}
        </div>

        {/* ── Auth Card ── */}
        {showForm && (
          <div
            className="rounded-xl border border-[#00d4ff18] glass-panel p-6 fade-in-scale"
            style={{ boxShadow: '0 0 40px #00d4ff10, 0 0 80px #9d00ff06' }}
          >
            {/* Header */}
            <div className="text-center mb-5">
              <div
                className="text-[10px] tracking-[5px] font-mono uppercase mb-1"
                style={{ color: '#00d4ff55' }}
              >
                {mode === 'signin' ? '[ AUTHENTICATION REQUIRED ]' : '[ NEW ENTITY REGISTRATION ]'}
              </div>
              <div
                className="text-lg font-black font-mono tracking-[3px]"
                style={{ color: mode === 'signin' ? '#00d4ff' : '#9d00ff',
                  textShadow: `0 0 15px ${mode === 'signin' ? '#00d4ff80' : '#9d00ff80'}` }}
              >
                {mode === 'signin' ? 'ENTER CREDENTIALS' : 'INITIALIZE PLAYER'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Player Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@systemx.io"
                    className="w-full bg-[#030308] border border-[#00d4ff20] rounded-lg px-3 py-3 text-[#e0e0ff] font-mono text-sm tracking-wider placeholder:text-[#ffffff10] focus:outline-none focus:border-[#00d4ff70] transition-all duration-300"
                    style={{ boxShadow: 'inset 0 0 15px #00d4ff05' }}
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00d4ff] status-dot"
                    style={{ boxShadow: '0 0 6px #00d4ff' }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Access Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#030308] border border-[#00d4ff20] rounded-lg px-3 py-3 text-[#e0e0ff] font-mono text-sm tracking-wider placeholder:text-[#ffffff10] focus:outline-none focus:border-[#00d4ff70] transition-all duration-300"
                    style={{ boxShadow: 'inset 0 0 15px #00d4ff05' }}
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#9d00ff] status-dot"
                    style={{ boxShadow: '0 0 6px #9d00ff' }} />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="p-3 rounded-lg border border-[#ff003c35] bg-[#ff003c09] failure-shake"
                  style={{ boxShadow: '0 0 15px #ff003c12' }}
                >
                  <p className="text-[10px] font-mono tracking-wider" style={{ color: '#ff6666' }}>
                    ⚠ SYSTEM ERROR: {error}
                  </p>
                </div>
              )}

              {/* Success message */}
              {successMsg && (
                <div
                  className="p-3 rounded-lg border border-[#00ff8835] bg-[#00ff8809]"
                  style={{ boxShadow: '0 0 15px #00ff8812' }}
                >
                  <p className="text-[10px] font-mono tracking-wider" style={{ color: '#00ff88' }}>
                    ✓ {successMsg}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-mono font-black tracking-[4px] text-sm uppercase transition-all duration-300 relative overflow-hidden active:scale-95"
                style={{
                  background: loading
                    ? '#0a0a1a'
                    : mode === 'signin'
                    ? 'linear-gradient(135deg, #002244, #004466)'
                    : 'linear-gradient(135deg, #1a0040, #300080)',
                  color: mode === 'signin' ? '#00d4ff' : '#9d00ff',
                  border: `1px solid ${mode === 'signin' ? '#00d4ff50' : '#9d00ff50'}`,
                  boxShadow: loading ? 'none' : mode === 'signin'
                    ? '0 0 25px #00d4ff30, inset 0 0 15px #00d4ff08'
                    : '0 0 25px #9d00ff30, inset 0 0 15px #9d00ff08',
                }}
              >
                {/* Shimmer on hover */}
                {!loading && <div className="absolute inset-0 shimmer opacity-30" />}
                <span className={loading ? 'cursor' : ''}>
                  {loading
                    ? 'AUTHENTICATING'
                    : mode === 'signin'
                    ? '◈ ENTER SYSTEM ◈'
                    : '◈ INITIALIZE PLAYER ◈'}
                </span>
              </button>
            </form>

            {/* Toggle mode */}
            <div className="mt-5 pt-4 border-t border-[#ffffff06] text-center">
              <p className="text-[9px] font-mono text-[#44445566] mb-1">
                {mode === 'signin' ? 'NOT YET REGISTERED IN THE SYSTEM?' : 'ALREADY REGISTERED?'}
              </p>
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccessMsg(null); }}
                className="text-[11px] font-mono tracking-wider transition-all duration-200 hover:brightness-125"
                style={{ color: mode === 'signin' ? '#9d00ff' : '#00d4ff' }}
              >
                {mode === 'signin' ? '→ CREATE NEW ACCOUNT' : '→ SIGN IN'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[9px] font-mono text-[#ffffff08] tracking-widest mt-6">
          SYSTEM X v3.0.0 — CLASSIFIED ◈ ANON KEY PROTECTED
        </p>
      </div>
    </div>
  );
}
