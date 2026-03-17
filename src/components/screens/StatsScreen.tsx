'use client';

import { useGameStore } from '@/store/gameStore';
import { HudCard } from '@/components/ui/HudCard';
import { StatBar } from '@/components/ui/StatBar';
import { RankBadge } from '@/components/ui/RankBadge';
import { RANK_COLORS, AURA_COLORS, ABILITIES } from '@/lib/gameData';

// Captured once at module load time — safe from purity rule
const MODULE_NOW = Date.now();

export function StatsScreen() {
  const { player } = useGameStore();
  const daysActive = Math.floor((MODULE_NOW - player.joinedAt) / 86400000);
  const auraColor = AURA_COLORS[player.aura] || '#00d4ff';
  const rankColor = RANK_COLORS[player.rank] || '#888888';

  const stats = [
    { key: 'strength', label: 'Strength', value: player.stats.strength, color: '#ff6633', icon: '💪' },
    { key: 'endurance', label: 'Endurance', value: player.stats.endurance, color: '#00d4ff', icon: '🏃' },
    { key: 'discipline', label: 'Discipline', value: player.stats.discipline, color: '#9d00ff', icon: '🧘' },
    { key: 'agility', label: 'Agility', value: player.stats.agility, color: '#00ff88', icon: '⚡' },
    { key: 'intelligence', label: 'Intelligence', value: player.stats.intelligence, color: '#ffcc00', icon: '🧠' },
  ];

  const totalStats = Object.values(player.stats).reduce((a, b) => a + b, 0);

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div>
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          Character Profile
        </div>
        <h2
          className="text-xl font-black tracking-widest font-mono"
          style={{ color: '#9d00ff', textShadow: '0 0 15px #9d00ff60' }}
        >
          STATS & LEVEL
        </h2>
      </div>

      {/* Character card */}
      <HudCard glowColor="purple" label="IDENTIFICATION">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 flex-shrink-0"
            style={{
              borderColor: auraColor,
              background: `radial-gradient(circle, ${auraColor}20, #0D0D0D)`,
              boxShadow: `0 0 25px ${auraColor}50`,
            }}
          >
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RankBadge rank={player.rank} size="lg" />
            </div>
            <div
              className="text-4xl font-black font-mono"
              style={{ color: rankColor, textShadow: `0 0 20px ${rankColor}80` }}
            >
              LVL {player.level}
            </div>
            <div className="text-[10px] text-[#8888aa] font-mono mt-0.5">{player.name}</div>
            <div
              className="text-[9px] font-mono mt-0.5 tracking-wider"
              style={{ color: auraColor }}
            >
              {player.aura.toUpperCase()} AURA · POWER: {totalStats}
            </div>
          </div>
        </div>
      </HudCard>

      {/* Stats bars */}
      <HudCard glowColor="blue" label="ATTRIBUTE MATRIX">
        <div className="space-y-4">
          {stats.map((stat) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              icon={stat.icon}
            />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[#ffffff08] flex justify-between items-center">
          <span className="text-[10px] text-[#8888aa] font-mono">TOTAL POWER</span>
          <span className="text-lg font-bold font-mono text-[#ffffff]">{totalStats}</span>
        </div>
      </HudCard>

      {/* Achievements */}
      <HudCard glowColor="none" label="RECORDS">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Current Streak', value: `${player.currentStreak}d`, icon: '🔥', color: '#ff6633' },
            { label: 'Best Streak', value: `${player.longestStreak}d`, icon: '🏆', color: '#ffcc00' },
            { label: 'Quests Done', value: player.totalQuestsCompleted, icon: '✓', color: '#00ff88' },
            { label: 'Days Active', value: `${daysActive}d`, icon: '📅', color: '#00d4ff' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#ffffff0a] p-3 bg-[#050510]"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-base font-bold font-mono" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-[9px] text-[#8888aa] font-mono tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </HudCard>

      {/* Abilities */}
      <HudCard glowColor="purple" label="UNLOCKED ABILITIES">
        <div className="space-y-2">
          {ABILITIES.map((ability) => {
            const stat = player.stats[ability.stat as keyof typeof player.stats];
            const unlocked = player.unlockedAbilities.includes(ability.id) || stat >= ability.req;
            return (
              <div
                key={ability.id}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all"
                style={{
                  borderColor: unlocked ? '#9d00ff30' : '#ffffff0a',
                  background: unlocked ? '#9d00ff08' : '#ffffff03',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <span className="text-xl">{ability.icon}</span>
                <div className="flex-1">
                  <div
                    className="text-xs font-bold font-mono"
                    style={{ color: unlocked ? '#9d00ff' : '#8888aa' }}
                  >
                    {ability.name}
                    {unlocked && (
                      <span className="ml-2 text-[8px] tracking-wider text-[#00ff88]">ACTIVE</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#8888aa] font-mono mt-0.5">{ability.description}</div>
                </div>
                {!unlocked && (
                  <div className="text-[9px] text-[#ff6633] font-mono whitespace-nowrap">
                    {ability.stat.toUpperCase()} {ability.req}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </HudCard>

      {/* Plan info */}
      <div
        className="rounded-lg p-3 border text-center"
        style={{
          borderColor: '#9d00ff40',
          background: 'linear-gradient(135deg, #1a003020, #0a001020)',
        }}
      >
        <div className="text-[9px] tracking-widest font-mono text-[#9d00ff] uppercase mb-1">
          Current Plan
        </div>
        <div
          className="text-lg font-bold font-mono"
          style={{ color: '#ffffff', textShadow: '0 0 15px #9d00ff' }}
        >
          {player.plan.toUpperCase()} PROTOCOL
        </div>
        <div className="text-[9px] text-[#8888aa] font-mono mt-1">
          {player.plan === 'pro'
            ? 'Full system access · Aura active · Unlimited operations'
            : 'Upgrade to unlock full potential'}
        </div>
      </div>
    </div>
  );
}
