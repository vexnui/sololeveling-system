'use client';

import { useState } from 'react';
import { HudCard } from '@/components/ui/HudCard';
import { RankBadge } from '@/components/ui/RankBadge';
import { LEADERBOARD, AURA_COLORS, RANK_COLORS } from '@/lib/gameData';
import type { Rank } from '@/types';
import clsx from 'clsx';

export function SocialScreen() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'pvp'>('leaderboard');

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div>
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          Global Network
        </div>
        <h2
          className="text-xl font-black tracking-widest font-mono"
          style={{ color: '#9d00ff', textShadow: '0 0 15px #9d00ff60' }}
        >
          RANKINGS
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[#0f0f1a] border border-[#ffffff0a]">
        {(['leaderboard', 'friends', 'pvp'] as const).map((tab) => {
          const labels = { leaderboard: '🏆 Global', friends: '👥 Friends', pvp: '⚔ PvP' };
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 py-2 rounded-md text-[10px] tracking-wider font-mono font-bold uppercase transition-all duration-200',
                active ? 'bg-[#00000060] text-[#9d00ff]' : 'opacity-40 hover:opacity-70 text-[#888888]'
              )}
              style={active ? { boxShadow: '0 0 10px #9d00ff20' } : {}}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {activeTab === 'leaderboard' && (
        <div className="space-y-2">
          {LEADERBOARD.map((entry) => {
            const auraColor = AURA_COLORS[entry.aura] || '#00d4ff';
            const rankColor = RANK_COLORS[entry.playerRank] || '#888888';
            const rankMedal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;

            return (
              <div
                key={entry.rank}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all',
                  entry.isCurrentUser
                    ? 'border-[#00d4ff40] bg-[#00d4ff08]'
                    : 'border-[#ffffff0a] bg-[#0f0f1a]'
                )}
                style={entry.rank <= 3 ? { boxShadow: `0 0 15px ${auraColor}20` } : {}}
              >
                {/* Rank number */}
                <div
                  className="w-8 text-center font-mono font-bold"
                  style={{
                    color: entry.rank === 1 ? '#ffcc00' : entry.rank === 2 ? '#aaaaaa' : entry.rank === 3 ? '#ff8844' : '#8888aa',
                    fontSize: entry.rank <= 3 ? '18px' : '12px',
                  }}
                >
                  {rankMedal || `#${entry.rank}`}
                </div>

                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base border flex-shrink-0"
                  style={{
                    borderColor: auraColor,
                    background: `radial-gradient(circle, ${auraColor}20, #0D0D0D)`,
                    boxShadow: `0 0 10px ${auraColor}40`,
                  }}
                >
                  ⚔️
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold font-mono truncate"
                      style={{
                        color: entry.isCurrentUser ? '#00d4ff' : '#e0e0ff',
                        textShadow: entry.isCurrentUser ? '0 0 10px #00d4ff60' : 'none',
                      }}
                    >
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-1.5 text-[8px] tracking-wider text-[#00d4ff80]">YOU</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RankBadge rank={entry.playerRank as Rank} size="sm" />
                    <span className="text-[9px] text-[#8888aa] font-mono">Lv.{entry.level}</span>
                    <span className="text-[9px] font-mono" style={{ color: rankColor }}>
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="space-y-4">
          <HudCard glowColor="none" label="ACTIVE ALLIES">
            {[
              { name: 'GHOST_PROTOCOL', level: 48, status: 'online', aura: 'blue' as const },
              { name: 'NEXUS_99', level: 65, status: 'in-quest', aura: 'purple' as const },
              { name: 'CIPHER_7', level: 29, status: 'offline', aura: 'white' as const },
            ].map((friend) => {
              const auraColor = AURA_COLORS[friend.aura];
              return (
                <div key={friend.name} className="flex items-center gap-3 py-2.5 border-b border-[#ffffff06] last:border-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base border flex-shrink-0"
                    style={{ borderColor: auraColor, background: `radial-gradient(circle, ${auraColor}15, #0D0D0D)` }}
                  >
                    ⚔️
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-mono font-bold text-[#e0e0ff]">{friend.name}</div>
                    <div className="text-[9px] font-mono mt-0.5" style={{ color: auraColor }}>Lv.{friend.level}</div>
                  </div>
                  <div
                    className="text-[9px] font-mono tracking-wider px-2 py-1 rounded-full"
                    style={{
                      color: friend.status === 'online' ? '#00ff88' : friend.status === 'in-quest' ? '#ffcc00' : '#8888aa',
                      background: friend.status === 'online' ? '#00ff8815' : friend.status === 'in-quest' ? '#ffcc0015' : '#88888815',
                    }}
                  >
                    {friend.status}
                  </div>
                </div>
              );
            })}
          </HudCard>

          <button
            className="w-full py-3 rounded-lg border border-dashed border-[#00d4ff25] text-[11px] tracking-widest font-mono text-[#8888aa] hover:text-[#00d4ff] hover:border-[#00d4ff50] transition-all"
          >
            + ADD ALLY BY CODE
          </button>
        </div>
      )}

      {activeTab === 'pvp' && (
        <div className="space-y-4">
          <div
            className="rounded-xl border border-[#ff003c30] bg-[#ff003c08] p-4"
            style={{ boxShadow: '0 0 20px #ff003c15' }}
          >
            <div className="text-[9px] tracking-[3px] text-[#ff003c] font-mono uppercase mb-2">⚔ PvP CHALLENGE SYSTEM</div>
            <p className="text-[11px] text-[#aaaaaa] font-mono leading-relaxed">
              Challenge other players. Set a fitness task. Winner gains XP. Loser receives a penalty quest. All challenges are private and voluntary.
            </p>
          </div>

          <HudCard glowColor="red" label="ACTIVE CHALLENGES">
            {[
              { opponent: 'APEX_HUNTER', task: '200 Push-Ups', deadline: '18 hours', status: 'in-progress' },
              { opponent: 'STEALTH_MODE', task: '10km Run', deadline: 'Expired', status: 'pending' },
            ].map((ch, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#ffffff06] last:border-0">
                <div className="text-xl">⚔️</div>
                <div className="flex-1">
                  <div className="text-sm font-mono font-bold text-[#ff6666]">vs {ch.opponent}</div>
                  <div className="text-[10px] text-[#8888aa] font-mono">{ch.task}</div>
                  <div className="text-[9px] text-[#ff003c88] font-mono">{ch.deadline}</div>
                </div>
                <div
                  className="text-[9px] px-2 py-1 rounded font-mono"
                  style={{
                    background: ch.status === 'in-progress' ? '#ffcc0020' : '#ff003c20',
                    color: ch.status === 'in-progress' ? '#ffcc00' : '#ff003c',
                  }}
                >
                  {ch.status}
                </div>
              </div>
            ))}
          </HudCard>

          <button
            className="w-full py-3.5 rounded-lg border border-[#ff003c40] font-mono text-sm font-bold tracking-widest text-[#ff003c] hover:bg-[#ff003c15] transition-all active:scale-95"
            style={{ boxShadow: '0 0 15px #ff003c20' }}
          >
            ⚔ ISSUE CHALLENGE
          </button>
        </div>
      )}
    </div>
  );
}
