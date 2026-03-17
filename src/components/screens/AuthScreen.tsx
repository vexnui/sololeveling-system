'use client';

import { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth_service';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('ALL FIELDS REQUIRED. THE SYSTEM DEMANDS COMPLETE INPUT.');
      return;
    }
    if (password.length < 6) {
      setError('PASSWORD TOO WEAK. MINIMUM 6 CHARACTERS REQUIRED.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: authError } = await signUpWithEmail(email.trim(), password);
        if (authError) {
          setError(authError.message.toUpperCase());
        } else {
          setSuccessMsg('ACCOUNT CREATED. PROCEEDING TO PLAYER REGISTRATION...');
          setTimeout(() => onAuthSuccess(), 1500);
        }
      } else {
        const { error: authError } = await signInWithEmail(email.trim(), password);
        if (authError) {
          setError(authError.message.toUpperCase());
        } else {
          setSuccessMsg('IDENTITY CONFIRMED. SYSTEM LINK ESTABLISHED.');
          setTimeout(() => onAuthSuccess(), 1000);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0D0D0D] grid-bg overflow-hidden">
      {/* Rotating aura rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="absolute w-[500px] h-[500px] rounded-full border border-[#00d4ff08]"
          style={{ animation: 'aura-rotate 20s linear infinite' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full border border-[#9d00ff08]"
          style={{ animation: 'aura-rotate 15s linear infinite reverse' }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full border border-[#00d4ff05]"
          style={{ animation: 'aura-rotate 10s linear infinite' }}
        />
      </div>

      <div className="relative w-full max-w-[380px] px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 flex items-center justify-center mb-4"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(135deg, #001133, #000820)',
              boxShadow: '0 0 40px #00d4ff40, inset 0 0 30px #00d4ff10',
            }}
          >
            <span
              className="text-2xl font-black font-mono tracking-widest"
              style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff' }}
            >
              SX
            </span>
          </div>
          <h1
            className="text-4xl font-black tracking-[6px] font-mono glitch mb-1"
            style={{ color: '#ffffff', textShadow: '0 0 20px #00d4ff80' }}
          >
            SYSTEM X
          </h1>
          <p className="text-[9px] tracking-[4px] font-mono text-[#00d4ff55] uppercase">
            {mode === 'signin' ? 'PLAYER IDENTIFICATION PROTOCOL' : 'NEW PLAYER REGISTRATION'}
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="rounded-lg border border-[#00d4ff18] bg-[#0a0a14] p-6"
          style={{ boxShadow: '0 0 30px #00d4ff10, inset 0 0 20px #00d4ff05' }}
        >
          {/* Corner brackets */}
          <div className="corner-brackets p-0">
            <div
              className="text-[10px] tracking-[4px] font-mono mb-5 text-center"
              style={{ color: '#00d4ff66' }}
            >
              {mode === 'signin' ? '[ AUTHENTICATION REQUIRED ]' : '[ INITIALIZE NEW PLAYER ]'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Player Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@systemx.io"
                  className="w-full bg-[#050510] border border-[#00d4ff20] rounded px-3 py-2.5 text-[#e0e0ff] font-mono text-sm tracking-wider placeholder:text-[#ffffff15] focus:outline-none focus:border-[#00d4ff60] transition-colors"
                  style={{ boxShadow: 'inset 0 0 10px #00d4ff05' }}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[9px] tracking-[3px] font-mono text-[#8888aa] uppercase block mb-1.5">
                  &gt; Access Code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#050510] border border-[#00d4ff20] rounded px-3 py-2.5 text-[#e0e0ff] font-mono text-sm tracking-wider placeholder:text-[#ffffff15] focus:outline-none focus:border-[#00d4ff60] transition-colors"
                  style={{ boxShadow: 'inset 0 0 10px #00d4ff05' }}
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="p-3 rounded border border-[#ff003c30] bg-[#ff003c08]"
                  style={{ boxShadow: '0 0 10px #ff003c10' }}
                >
                  <p className="text-[10px] font-mono text-[#ff6666] tracking-wider">
                    ⚠ {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {successMsg && (
                <div
                  className="p-3 rounded border border-[#00ff8830] bg-[#00ff8808]"
                  style={{ boxShadow: '0 0 10px #00ff8810' }}
                >
                  <p className="text-[10px] font-mono text-[#00ff88] tracking-wider">
                    ✓ {successMsg}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded font-mono font-bold tracking-[3px] text-sm uppercase transition-all relative overflow-hidden"
                style={{
                  background: loading
                    ? '#001a33'
                    : 'linear-gradient(135deg, #003366, #004488)',
                  color: '#00d4ff',
                  border: '1px solid #00d4ff40',
                  boxShadow: loading ? 'none' : '0 0 20px #00d4ff30',
                }}
              >
                {loading ? (
                  <span className="cursor">AUTHENTICATING</span>
                ) : mode === 'signin' ? (
                  'ENTER SYSTEM'
                ) : (
                  'INITIALIZE PLAYER'
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-5 text-center">
              <p className="text-[9px] font-mono text-[#555577]">
                {mode === 'signin' ? 'NEW TO THE SYSTEM?' : 'ALREADY REGISTERED?'}
              </p>
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccessMsg(null); }}
                className="text-[10px] font-mono tracking-wider mt-1 transition-colors"
                style={{ color: '#9d00ff' }}
              >
                {mode === 'signin' ? '→ CREATE ACCOUNT' : '→ SIGN IN'}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] font-mono text-[#ffffff10] tracking-widest mt-6">
          SYSTEM X v3.0.0 — CLASSIFIED
        </p>
      </div>
    </div>
  );
}
