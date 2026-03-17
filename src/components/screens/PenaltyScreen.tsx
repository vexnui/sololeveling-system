'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function PenaltyScreen() {
  const { setShowPenaltyScreen, penaltyActive, showNotification } = useGameStore();
  const [phase, setPhase] = useState<'warning' | 'details'>('warning');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('details'), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    showNotification({ type: 'penalty', message: 'Penalty quest activated. Complete it to restore status.' });
    setTimeout(() => setShowPenaltyScreen(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center overflow-hidden">
      {/* Flashing red background */}
      <div
        className="absolute inset-0 warning-flash"
        style={{ background: '#0D0D0D' }}
      />

      {/* Red border glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(255,0,60,0.3)',
          border: '2px solid rgba(255,0,60,0.4)',
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,60,0.5) 2px, rgba(255,0,60,0.5) 4px)',
        }}
      />

      {phase === 'warning' ? (
        <div className="text-center z-10 px-8">
          <div
            className="text-7xl font-black font-mono tracking-wider mb-4"
            style={{
              color: '#ff003c',
              textShadow: '0 0 30px #ff003c, 0 0 60px #ff003c80, 0 0 100px #ff003c40',
              animation: 'flicker 2s infinite',
            }}
          >
            ⚠
          </div>
          <div
            className="text-3xl font-black font-mono tracking-[4px]"
            style={{
              color: '#ff003c',
              textShadow: '0 0 20px #ff003c',
            }}
          >
            SYSTEM ALERT
          </div>
          <div
            className="text-[11px] tracking-[6px] font-mono mt-2"
            style={{ color: '#ff003c88' }}
          >
            PENALTY PROTOCOL ACTIVATED
          </div>
        </div>
      ) : (
        <div className="z-10 w-full max-w-sm px-6 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div
              className="text-[10px] tracking-[6px] font-mono uppercase mb-2"
              style={{ color: '#ff003c88' }}
            >
              SYSTEM NOTIFICATION
            </div>
            <h1
              className="text-3xl font-black font-mono tracking-wider"
              style={{ color: '#ff003c', textShadow: '0 0 20px #ff003c80' }}
            >
              QUEST FAILED
            </h1>
            <p
              className="text-[11px] font-mono mt-2 leading-relaxed"
              style={{ color: '#ff6666' }}
            >
              Weakness detected. The system has registered your failure. Penalty protocols are now active.
            </p>
          </div>

          {/* Penalty details */}
          <div
            className="rounded-xl border border-[#ff003c40] p-4"
            style={{ background: '#ff003c08', boxShadow: '0 0 20px #ff003c20' }}
          >
            <div className="text-[9px] tracking-[3px] text-[#ff003c88] font-mono uppercase mb-3">
              ASSIGNED PENALTY
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💀</span>
                <div>
                  <div className="text-sm font-bold font-mono text-[#ff6666]">Double Workload Protocol</div>
                  <div className="text-[10px] text-[#ff003c88] font-mono">200 Push-Ups · 100 Squats · 5km Run</div>
                </div>
              </div>

              <div className="border-t border-[#ff003c15] pt-3 grid grid-cols-2 gap-3">
                {[
                  { label: 'XP Penalty', value: '-300 XP', color: '#ff003c' },
                  { label: 'Deadline', value: '24 hours', color: '#ff6600' },
                  { label: 'Miss streak', value: `${1} day`, color: '#ffcc00' },
                  { label: 'Status', value: 'RESTRICTED', color: '#ff003c' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[9px] text-[#8888aa] font-mono tracking-wider">{item.label}</div>
                    <div className="text-xs font-bold font-mono mt-0.5" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Penalty escalation */}
          <div className="rounded-lg border border-[#ff003c20] bg-[#ff003c06] p-3">
            <div className="text-[9px] text-[#ff003c] font-mono tracking-wider uppercase mb-2">
              ESCALATION WARNING
            </div>
            <div className="space-y-1">
              {[
                { days: '1 day missed', result: '+20% workload' },
                { days: '2 days missed', result: 'Increased difficulty' },
                { days: '3 days missed', result: 'RANK DROP' },
                { days: '5 days missed', result: 'SYSTEM LOCK' },
              ].map((item) => (
                <div key={item.days} className="flex justify-between text-[9px] font-mono">
                  <span className="text-[#ff003c88]">{item.days}</span>
                  <span style={{ color: item.days.includes('5') ? '#ff003c' : '#ff6600' }}>→ {item.result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={handleAccept}
              disabled={accepted}
              className="w-full py-4 rounded-xl font-black font-mono text-sm tracking-[3px] transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #ff003c, #cc0030)',
                color: '#ffffff',
                boxShadow: '0 0 20px #ff003c50',
                textShadow: '0 0 10px rgba(0,0,0,0.5)',
              }}
            >
              {accepted ? 'ACKNOWLEDGED' : 'ACCEPT PENALTY'}
            </button>
            <button
              onClick={() => setShowPenaltyScreen(false)}
              className="w-full py-3 rounded-xl font-mono text-xs tracking-widest text-[#8888aa] border border-[#ffffff0a] hover:border-[#ffffff15] transition-all"
            >
              VIEW PENALTY QUEST
            </button>
          </div>

          {/* System quote */}
          <div className="text-center">
            <p
              className="text-[10px] italic font-mono"
              style={{ color: '#ff003c50' }}
            >
              &ldquo;The system is absolute. There are no exceptions.&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
