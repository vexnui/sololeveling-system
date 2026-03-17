'use client';

import { useGameStore } from '@/store/gameStore';
import { AURA_COLORS, RANK_COLORS } from '@/lib/gameData';

export function AuraScreen() {
  const { player } = useGameStore();
  const auraColor = AURA_COLORS[player.aura] || '#00d4ff';
  const rankColor = RANK_COLORS[player.rank] || '#888888';

  const auraTiers = [
    { name: 'White', color: '#ffffff', minLevel: 1, desc: 'Base state. Potential unrealized.' },
    { name: 'Blue', color: '#00d4ff', minLevel: 20, desc: 'Awakening detected. Power flowing.' },
    { name: 'Purple', color: '#9d00ff', minLevel: 40, desc: 'High-rank energy. Dangerous aura.' },
    { name: 'Red', color: '#ff003c', minLevel: 70, desc: 'Sovereign power. Fear the player.' },
    { name: 'Gold', color: '#ffcc00', minLevel: 90, desc: 'Transcendent. Beyond human limits.' },
  ];

  const currentTierIndex = auraTiers.findIndex((t) => t.name.toLowerCase() === player.aura);

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div>
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          Pro Feature
        </div>
        <h2
          className="text-xl font-black tracking-widest font-mono"
          style={{ color: auraColor, textShadow: `0 0 15px ${auraColor}60` }}
        >
          AURA VISUALIZATION
        </h2>
      </div>

      {/* Main aura display */}
      <div
        className="relative rounded-2xl border overflow-hidden flex flex-col items-center justify-center py-12"
        style={{
          borderColor: `${auraColor}30`,
          background: `radial-gradient(ellipse at center, ${auraColor}08 0%, #0D0D0D 70%)`,
          minHeight: '320px',
        }}
      >
        {/* Outer rotating rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-dashed opacity-20"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              borderColor: auraColor,
              animation: `aura-rotate ${4 + i * 2}s linear ${i % 2 === 0 ? 'reverse' : 'normal'} infinite`,
            }}
          />
        ))}

        {/* Pulsing aura layers */}
        {[1, 2, 3].map((i) => (
          <div
            key={`pulse-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 20}px`,
              height: `${80 + i * 20}px`,
              background: `radial-gradient(circle, ${auraColor}${40 - i * 10} 0%, transparent 70%)`,
              animation: `aura-pulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Character silhouette */}
        <div
          className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center border-2"
          style={{
            borderColor: auraColor,
            background: `radial-gradient(circle, ${auraColor}25, #0D0D0D)`,
            boxShadow: `0 0 40px ${auraColor}60, 0 0 80px ${auraColor}30, inset 0 0 30px ${auraColor}15`,
          }}
        >
          <span
            className="text-5xl"
            style={{ filter: `drop-shadow(0 0 15px ${auraColor})` }}
          >
            ⚔️
          </span>
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{
              background: auraColor,
              boxShadow: `0 0 4px ${auraColor}`,
              top: `${20 + Math.sin(i * 0.8) * 35}%`,
              left: `${20 + Math.cos(i * 0.8) * 35}%`,
              animation: `aura-pulse ${1.5 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}

        {/* Player info overlay */}
        <div className="relative z-10 text-center mt-6">
          <div className="text-[9px] tracking-[4px] font-mono text-[#8888aa] uppercase mb-1">
            {player.aura.toUpperCase()} AURA — RANK [{player.rank}]
          </div>
          <div
            className="text-2xl font-black font-mono tracking-widest"
            style={{ color: rankColor, textShadow: `0 0 20px ${rankColor}80` }}
          >
            LVL {player.level}
          </div>
          <div className="text-[10px] font-mono mt-1" style={{ color: auraColor }}>
            {player.name}
          </div>
        </div>
      </div>

      {/* Aura tiers */}
      <div>
        <div className="text-[9px] tracking-[3px] text-[#8888aa] font-mono uppercase mb-2">
          AURA EVOLUTION PATH
        </div>
        <div className="space-y-2">
          {auraTiers.map((tier, idx) => {
            const unlocked = player.level >= tier.minLevel;
            const current = idx === currentTierIndex;
            return (
              <div
                key={tier.name}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all"
                style={{
                  borderColor: current ? `${tier.color}50` : unlocked ? `${tier.color}20` : '#ffffff08',
                  background: current ? `${tier.color}10` : unlocked ? `${tier.color}05` : '#ffffff03',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                {/* Aura orb */}
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 border"
                  style={{
                    background: `radial-gradient(circle, ${tier.color}40, ${tier.color}10)`,
                    borderColor: tier.color,
                    boxShadow: unlocked ? `0 0 10px ${tier.color}60` : 'none',
                  }}
                />
                <div className="flex-1">
                  <div
                    className="text-sm font-bold font-mono"
                    style={{ color: unlocked ? tier.color : '#8888aa' }}
                  >
                    {tier.name} Aura
                    {current && (
                      <span className="ml-2 text-[8px] tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${tier.color}25`, color: tier.color }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#8888aa] font-mono mt-0.5">{tier.desc}</div>
                </div>
                <div
                  className="text-[9px] font-mono whitespace-nowrap"
                  style={{ color: unlocked ? '#00ff88' : '#8888aa' }}
                >
                  {unlocked ? '✓ LVL ' + tier.minLevel : 'LVL ' + tier.minLevel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share card */}
      <div
        className="rounded-xl border border-[#00d4ff20] bg-[#00d4ff08] p-4 text-center"
        style={{ boxShadow: '0 0 20px #00d4ff10' }}
      >
        <div className="text-[10px] tracking-widest font-mono text-[#00d4ff] uppercase mb-1">
          Share Your Progress
        </div>
        <div className="text-[11px] text-[#8888aa] font-mono mb-3">
          Generate a shareable rank card for social media
        </div>
        <button
          className="px-6 py-2.5 rounded-lg border border-[#00d4ff40] font-mono text-[11px] font-bold tracking-widest text-[#00d4ff] hover:bg-[#00d4ff20] transition-all active:scale-95"
          style={{ boxShadow: '0 0 10px #00d4ff20' }}
        >
          GENERATE RANK CARD
        </button>
      </div>
    </div>
  );
}
