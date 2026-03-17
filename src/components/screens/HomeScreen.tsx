'use client';

import { useGameStore } from '@/store/gameStore';
import { HudCard } from '@/components/ui/HudCard';
import { XpBar } from '@/components/ui/XpBar';
import { RankBadge } from '@/components/ui/RankBadge';
import { RANK_COLORS, AURA_COLORS } from '@/lib/gameData';

export function HomeScreen() {
  const { player, quests, systemMessages, setScreen, setShowPenaltyScreen, penaltyActive } = useGameStore();
  const auraColor = AURA_COLORS[player.aura] || '#00d4ff';
  const rankColor = RANK_COLORS[player.rank] || '#888888';

  const todayQuests = quests.filter((q) => q.type === 'daily' || q.type === 'side');
  const completedToday = todayQuests.filter((q) => q.status === 'completed').length;
  const unreadMessages = systemMessages.filter((m) => !m.read).length;

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen grid-bg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
            System X — HQ Interface
          </div>
          <h1
            className="text-lg font-black tracking-widest font-mono glitch"
            style={{ color: '#ffffff', textShadow: '0 0 15px #00d4ff60' }}
          >
            {player.name}
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setScreen('chat')}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#00d4ff22] bg-[#0f0f1a] text-lg"
            style={{ boxShadow: '0 0 10px #00d4ff20' }}
          >
            🔔
          </button>
          {unreadMessages > 0 && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold font-mono"
              style={{ background: '#ff003c', boxShadow: '0 0 8px #ff003c' }}
            >
              {unreadMessages}
            </div>
          )}
        </div>
      </div>

      {/* Player Hero Card */}
      <HudCard glowColor="purple" label="PLAYER STATUS">
        <div className="flex items-center gap-4">
          {/* Aura Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 aura-container"
              style={{
                borderColor: auraColor,
                background: `radial-gradient(circle, ${auraColor}20, #0D0D0D)`,
                boxShadow: `0 0 20px ${auraColor}60, inset 0 0 15px ${auraColor}20`,
              }}
            >
              ⚔️
            </div>
            {/* Aura ring */}
            <div
              className="absolute inset-[-4px] rounded-full border border-dashed aura-ring opacity-60"
              style={{ borderColor: auraColor }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <RankBadge rank={player.rank} />
              <span
                className="text-[9px] tracking-[3px] font-mono uppercase"
                style={{ color: auraColor }}
              >
                {player.aura} Aura
              </span>
            </div>
            <div
              className="text-3xl font-black font-mono tracking-wider"
              style={{ color: rankColor, textShadow: `0 0 15px ${rankColor}80` }}
            >
              LVL {player.level}
            </div>
            <div className="text-[10px] text-[#8888aa] font-mono mt-0.5 truncate">
              {player.currentStreak}d streak · {player.totalQuestsCompleted} quests done
            </div>
          </div>
        </div>

        <div className="mt-4">
          <XpBar current={player.xp} max={player.xpToNextLevel} level={player.level} />
        </div>
      </HudCard>

      {/* Stats Quick View */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'STR', value: player.stats.strength, color: '#ff6633', icon: '💪' },
          { label: 'END', value: player.stats.endurance, color: '#00d4ff', icon: '🏃' },
          { label: 'DSC', value: player.stats.discipline, color: '#9d00ff', icon: '🧠' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border p-2.5 text-center bg-[#0f0f1a]"
            style={{ borderColor: `${stat.color}25`, boxShadow: `0 0 10px ${stat.color}15` }}
          >
            <div className="text-base">{stat.icon}</div>
            <div className="text-[9px] tracking-widest font-mono mt-0.5" style={{ color: stat.color }}>
              {stat.label}
            </div>
            <div className="text-base font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Quests Preview */}
      <HudCard glowColor="blue" label="DAILY OPERATIONS">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs">📋</span>
            <span className="text-[10px] tracking-widest font-mono text-[#00d4ff] uppercase">
              {completedToday}/{todayQuests.length} Complete
            </span>
          </div>
          <button
            onClick={() => setScreen('quests')}
            className="text-[9px] tracking-widest font-mono text-[#8888aa] hover:text-[#00d4ff] uppercase transition-colors"
          >
            VIEW ALL →
          </button>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="h-1.5 bg-[#ffffff08] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${todayQuests.length ? (completedToday / todayQuests.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #003366, #00d4ff)',
              }}
            />
          </div>
        </div>

        {/* Quest previews */}
        <div className="space-y-2">
          {quests.slice(0, 3).map((q) => (
            <div
              key={q.id}
              className="flex items-center gap-2.5 p-2 rounded border"
              style={{
                borderColor: q.status === 'completed' ? '#00ff8820' : q.status === 'penalty' ? '#ff003c30' : '#00d4ff15',
                background: q.status === 'completed' ? '#00ff8808' : q.status === 'penalty' ? '#ff003c08' : '#00d4ff05',
              }}
            >
              <span className="text-base">{q.icon}</span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[11px] font-mono truncate"
                  style={{
                    color: q.status === 'completed' ? '#00ff8888' : q.status === 'penalty' ? '#ff6666' : '#e0e0ff',
                    textDecoration: q.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  {q.title}
                </div>
                <div className="text-[9px] text-[#8888aa] font-mono">+{q.xpReward} XP</div>
              </div>
              <div
                className="text-[9px] font-mono tracking-wider"
                style={{
                  color: q.status === 'completed' ? '#00ff88' : q.status === 'penalty' ? '#ff003c' : '#ffcc00',
                }}
              >
                {q.status === 'completed' ? '✓' : q.status === 'penalty' ? '⚠' : '○'}
              </div>
            </div>
          ))}
        </div>
      </HudCard>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setScreen('boss')}
          className="relative rounded-lg p-4 text-center border border-[#ffcc0025] bg-[#0f0f1a] overflow-hidden"
          style={{ boxShadow: '0 0 15px #ffcc0015' }}
        >
          <div className="text-2xl mb-1">⚔️</div>
          <div className="text-[9px] tracking-widest font-mono text-[#ffcc00] uppercase">Boss Fight</div>
          <div className="text-[8px] text-[#888888] font-mono mt-0.5">Weekly Challenge</div>
        </button>

        <button
          onClick={() => setScreen('social')}
          className="relative rounded-lg p-4 text-center border border-[#9d00ff25] bg-[#0f0f1a] overflow-hidden"
          style={{ boxShadow: '0 0 15px #9d00ff15' }}
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-[9px] tracking-widest font-mono text-[#9d00ff] uppercase">Rankings</div>
          <div className="text-[8px] text-[#888888] font-mono mt-0.5">Global Board</div>
        </button>

        <button
          onClick={() => setScreen('aura')}
          className="relative rounded-lg p-4 text-center border border-[#00ffea25] bg-[#0f0f1a] overflow-hidden"
          style={{ boxShadow: '0 0 15px #00ffea15' }}
        >
          <div className="text-2xl mb-1">✨</div>
          <div className="text-[9px] tracking-widest font-mono text-[#00ffea] uppercase">Aura</div>
          <div className="text-[8px] text-[#888888] font-mono mt-0.5">Visualization</div>
        </button>

        {penaltyActive ? (
          <button
            onClick={() => setShowPenaltyScreen(true)}
            className="relative rounded-lg p-4 text-center border bg-[#0f0f1a] overflow-hidden warning-flash pulse-red"
            style={{ borderColor: '#ff003c60' }}
          >
            <div className="text-2xl mb-1">⚠️</div>
            <div className="text-[9px] tracking-widest font-mono text-[#ff003c] uppercase">Penalty</div>
            <div className="text-[8px] text-[#ff6666] font-mono mt-0.5">ACTIVE</div>
          </button>
        ) : (
          <button
            onClick={() => setScreen('stats')}
            className="relative rounded-lg p-4 text-center border border-[#ff663325] bg-[#0f0f1a] overflow-hidden"
            style={{ boxShadow: '0 0 15px #ff663315' }}
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="text-[9px] tracking-widest font-mono text-[#ff6633] uppercase">Stats</div>
            <div className="text-[8px] text-[#888888] font-mono mt-0.5">Skill Tree</div>
          </button>
        )}
      </div>

      {/* System Messages */}
      {systemMessages.filter((m) => !m.read).length > 0 && (
        <HudCard glowColor="none" label="SYSTEM MESSAGES">
          <div className="space-y-2">
            {systemMessages
              .filter((m) => !m.read)
              .slice(0, 2)
              .map((msg) => {
                const colors = {
                  warning: '#ff6600', info: '#00d4ff', success: '#00ff88',
                  penalty: '#ff003c', levelup: '#9d00ff',
                };
                const color = colors[msg.type];
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded border"
                    style={{ borderColor: `${color}25`, background: `${color}08` }}
                  >
                    <div className="text-[9px] tracking-widest font-mono font-bold mb-0.5" style={{ color }}>
                      ■ {msg.title}
                    </div>
                    <div className="text-[10px] text-[#8888aa] font-mono line-clamp-2">{msg.content}</div>
                  </div>
                );
              })}
          </div>
        </HudCard>
      )}
    </div>
  );
}
