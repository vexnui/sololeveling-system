'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { HudCard } from '@/components/ui/HudCard';

function useCountdown(endsAt: number) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const remaining = endsAt - Date.now();
      if (remaining <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return time;
}

export function BossScreen() {
  const { boss, updateBossProgress, showNotification } = useGameStore();
  const countdown = useCountdown(boss.endsAt);
  const pct = Math.min(100, Math.round((boss.progress / boss.goal) * 100));
  const [adding, setAdding] = useState('');

  const handleAdd = () => {
    const val = parseInt(adding);
    if (!isNaN(val) && val > 0) {
      updateBossProgress(val);
      showNotification({ type: 'boss', message: `+${val} progress added to Boss Challenge!` });
      setAdding('');
    }
  };

  const isUrgent = countdown.days === 0 && countdown.hours < 12;
  const isCritical = countdown.days === 0 && countdown.hours < 3;

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div>
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          Weekly Challenge
        </div>
        <h2
          className="text-xl font-black tracking-widest font-mono"
          style={{ color: '#ffcc00', textShadow: '0 0 15px #ffcc0060' }}
        >
          BOSS FIGHT
        </h2>
      </div>

      {/* Boss card */}
      <div
        className="relative rounded-xl border overflow-hidden"
        style={{
          borderColor: '#ffcc0030',
          background: 'linear-gradient(135deg, #1a0f00, #0f0a00)',
          boxShadow: '0 0 30px #ffcc0020, inset 0 0 30px #ffcc0005',
        }}
      >
        {/* Boss header with glowing title */}
        <div className="p-4 border-b border-[#ffcc0015]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[9px] tracking-[3px] text-[#ffcc0088] font-mono uppercase mb-1">
                ⚔ WEEKLY BOSS ENCOUNTER
              </div>
              <h3
                className="text-xl font-black font-mono tracking-wider"
                style={{ color: '#ffcc00', textShadow: '0 0 15px #ffcc0080' }}
              >
                {boss.title}
              </h3>
            </div>
            <div
              className="text-4xl"
              style={{ filter: 'drop-shadow(0 0 15px #ffcc00)' }}
            >
              👹
            </div>
          </div>
          <p className="text-[11px] text-[#aaa888] font-mono mt-2 leading-relaxed">
            {boss.description}
          </p>
        </div>

        {/* Progress */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] tracking-widest font-mono text-[#ffcc00] uppercase">
              Damage Dealt
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: pct >= 100 ? '#00ff88' : '#ffcc00' }}>
              {boss.progress.toLocaleString()} / {boss.goal.toLocaleString()} {boss.unit}
            </span>
          </div>

          {/* Boss HP bar (inverted — we're dealing damage) */}
          <div className="relative h-6 bg-[#ff003c30] rounded-lg overflow-hidden border border-[#ff003c20]">
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#ff003c30] transition-all duration-700"
              style={{ width: `${100 - pct}%` }}
            />
            <div
              className="absolute left-0 top-0 bottom-0 rounded-lg transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: pct >= 100
                  ? 'linear-gradient(90deg, #00ff88, #00ffaa)'
                  : 'linear-gradient(90deg, #ff6600, #ffcc00)',
                boxShadow: '0 0 15px #ffcc0060',
              }}
            >
              <div className="absolute inset-0 shimmer opacity-50" />
            </div>
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono"
              style={{ color: '#ffffff', textShadow: '0 0 6px #000' }}
            >
              {pct}% COMPLETE
            </span>
          </div>

          <div className="text-right mt-1">
            <span className="text-[9px] text-[#ffcc0066] font-mono">
              {boss.goal - boss.progress > 0 ? `${(boss.goal - boss.progress).toLocaleString()} remaining` : 'BOSS DEFEATED!'}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <HudCard
        glowColor={isCritical ? 'red' : isUrgent ? 'none' : 'none'}
        label="TIME REMAINING"
      >
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
            { label: 'Seconds', value: countdown.seconds },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center">
              <div
                className="text-3xl font-black font-mono tabular-nums"
                style={{
                  color: isCritical ? '#ff003c' : isUrgent ? '#ff6600' : '#ffcc00',
                  textShadow: `0 0 15px ${isCritical ? '#ff003c' : '#ffcc00'}80`,
                }}
              >
                {String(t.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] text-[#8888aa] font-mono tracking-widest uppercase">{t.label}</div>
            </div>
          ))}
        </div>
        {isCritical && (
          <div className="mt-3 text-center text-[10px] font-mono text-[#ff003c] tracking-wider warning-flash">
            ⚠ CRITICAL — FAILURE IMMINENT
          </div>
        )}
      </HudCard>

      {/* Rewards & Penalty */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg border border-[#00ff8825] bg-[#00ff8808] p-3"
        >
          <div className="text-[9px] tracking-widest text-[#00ff88] font-mono uppercase mb-2">
            ✓ Victory
          </div>
          <div className="text-base font-bold text-[#00ff88] font-mono">+{boss.xpReward.toLocaleString()} XP</div>
          {boss.rankBoost && (
            <div className="text-[10px] text-[#00ff8888] font-mono mt-1">+ Rank Boost</div>
          )}
        </div>
        <div
          className="rounded-lg border border-[#ff003c25] bg-[#ff003c08] p-3"
        >
          <div className="text-[9px] tracking-widest text-[#ff003c] font-mono uppercase mb-2">
            ✗ Failure
          </div>
          <div className="text-base font-bold text-[#ff003c] font-mono">-{boss.penaltyXp.toLocaleString()} XP</div>
          <div className="text-[10px] text-[#ff003c88] font-mono mt-1">+ Penalty Quest</div>
        </div>
      </div>

      {/* Add progress input */}
      {!boss.completed && (
        <HudCard glowColor="blue" label="LOG PROGRESS">
          <div className="flex gap-2">
            <input
              type="number"
              value={adding}
              onChange={(e) => setAdding(e.target.value)}
              placeholder="Enter push-ups completed..."
              className="flex-1 bg-[#050510] border border-[#00d4ff20] rounded-lg px-3 py-2.5 text-sm font-mono text-[#e0e0ff] placeholder-[#8888aa44] outline-none focus:border-[#00d4ff50]"
              style={{ color: '#e0e0ff' }}
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 rounded-lg border border-[#00d4ff40] font-mono text-[11px] font-bold tracking-widest text-[#00d4ff] transition-all hover:bg-[#00d4ff20] active:scale-95"
              style={{ boxShadow: '0 0 10px #00d4ff20' }}
            >
              LOG
            </button>
          </div>
          <p className="text-[9px] text-[#8888aa] font-mono mt-2">
            Upload photo proof is required for verification in Pro mode.
          </p>
        </HudCard>
      )}

      {boss.completed && (
        <div
          className="rounded-xl border border-[#00ff8840] bg-[#00ff8810] p-6 text-center"
          style={{ boxShadow: '0 0 30px #00ff8830' }}
        >
          <div className="text-4xl mb-3">🏆</div>
          <div
            className="text-xl font-black font-mono tracking-wider"
            style={{ color: '#00ff88', textShadow: '0 0 15px #00ff88' }}
          >
            BOSS DEFEATED
          </div>
          <div className="text-sm font-mono text-[#00ff8888] mt-1">
            +{boss.xpReward.toLocaleString()} XP Awarded
          </div>
        </div>
      )}
    </div>
  );
}
