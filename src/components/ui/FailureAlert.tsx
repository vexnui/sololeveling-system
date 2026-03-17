'use client';

import { useEffect } from 'react';

interface FailureAlertProps {
  questTitle: string;
  onDismiss: () => void;
}

export function FailureAlert({ questTitle, onDismiss }: FailureAlertProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={onDismiss}
    >
      {/* Red border flash */}
      <div
        className="absolute inset-0 pointer-events-none warning-flash"
        style={{ boxShadow: 'inset 0 0 80px rgba(255,0,60,0.25)' }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,60,0.4) 3px, rgba(255,0,60,0.4) 6px)',
        }}
      />

      <div className="relative failure-shake text-center px-10 py-9 max-w-[320px] w-full">
        {/* Glow border */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: '0 0 60px #ff003c30, inset 0 0 40px #ff003c10',
            border: '1px solid #ff003c30',
            background: 'rgba(255, 0, 60, 0.04)',
          }}
        />

        <div className="relative z-10">
          <div
            className="text-6xl mb-4 flicker"
            style={{ filter: 'drop-shadow(0 0 20px #ff003c)' }}
          >
            ✗
          </div>

          <div
            className="text-[10px] tracking-[5px] font-mono mb-1 uppercase"
            style={{ color: '#ff003c66' }}
          >
            SYSTEM ALERT
          </div>
          <div
            className="text-2xl font-black font-mono tracking-[3px] mb-2"
            style={{ color: '#ff003c', textShadow: '0 0 25px #ff003c80' }}
          >
            YOU FAILED YOUR<br />DAILY QUEST
          </div>

          <div
            className="text-sm font-mono mb-4 leading-snug"
            style={{ color: '#ff666688' }}
          >
            {questTitle}
          </div>

          <div
            className="px-4 py-2 rounded-lg font-mono text-[10px] tracking-[3px] mb-4"
            style={{
              background: 'rgba(255,0,60,0.08)',
              border: '1px solid #ff003c30',
              color: '#ff6666',
            }}
          >
            ⚠ PENALTY QUEST ASSIGNED
          </div>

          <p
            className="text-[10px] italic font-mono"
            style={{ color: '#ff003c44' }}
          >
            &ldquo;Weakness detected. The system will not forgive.&rdquo;
          </p>

          <div className="mt-4 text-[9px] text-[#8888aa] font-mono tracking-wider">
            TAP TO ACKNOWLEDGE
          </div>
        </div>
      </div>
    </div>
  );
}
