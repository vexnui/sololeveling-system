'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { HudCard } from '@/components/ui/HudCard';
import type { Quest } from '@/types';
import clsx from 'clsx';

type Tab = 'daily' | 'side' | 'penalty';

const DIFFICULTY_STARS = (n: number) =>
  '★'.repeat(n) + '☆'.repeat(5 - n);

function QuestCard({ quest, onComplete }: { quest: Quest; onComplete: () => void }) {
  const statusColors = {
    completed: { border: '#00ff8825', bg: '#00ff8808', text: '#00ff88', label: '✓ COMPLETE' },
    pending: { border: '#ffcc0025', bg: '#ffcc0005', text: '#ffcc00', label: '○ PENDING' },
    failed: { border: '#ff003c25', bg: '#ff003c08', text: '#ff003c', label: '✗ FAILED' },
    penalty: { border: '#ff003c40', bg: '#ff003c12', text: '#ff003c', label: '⚠ PENALTY' },
  };
  const cfg = statusColors[quest.status];
  const diffColors = ['', '#888', '#00d4ff', '#ffcc00', '#ff6633', '#ff003c'];

  return (
    <div
      className="rounded-lg border p-3.5 quest-card transition-all"
      style={{ borderColor: cfg.border, background: cfg.bg }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border"
          style={{ borderColor: cfg.border, background: '#0D0D0D' }}
        >
          {quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-sm font-bold font-mono"
              style={{
                color: quest.status === 'completed' ? '#8888aa' : '#e0e0ff',
                textDecoration: quest.status === 'completed' ? 'line-through' : 'none',
              }}
            >
              {quest.title}
            </h3>
            <span className="text-[9px] font-mono font-bold whitespace-nowrap" style={{ color: cfg.text }}>
              {cfg.label}
            </span>
          </div>
          <p className="text-[10px] text-[#8888aa] font-mono mt-0.5 leading-relaxed">
            {quest.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <span
                className="text-[9px] font-mono tracking-wider"
                style={{ color: diffColors[quest.difficulty] }}
              >
                {DIFFICULTY_STARS(quest.difficulty)}
              </span>
              <span className="text-[9px] font-mono text-[#00d4ff88]">+{quest.xpReward} XP</span>
            </div>
            {quest.status === 'pending' && (
              <button
                onClick={onComplete}
                className="text-[9px] font-mono font-bold tracking-widest px-3 py-1.5 rounded border transition-all hover:bg-[#00d4ff20] active:scale-95"
                style={{
                  color: '#00d4ff',
                  borderColor: '#00d4ff40',
                  boxShadow: '0 0 8px #00d4ff20',
                }}
              >
                COMPLETE
              </button>
            )}
            {quest.status === 'penalty' && (
              <button
                onClick={onComplete}
                className="text-[9px] font-mono font-bold tracking-widest px-3 py-1.5 rounded border pulse-red transition-all active:scale-95"
                style={{ color: '#ff003c', borderColor: '#ff003c60' }}
              >
                COMPLETE NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const { quests, completeQuest } = useGameStore();

  const tabs: { key: Tab; label: string; color: string }[] = [
    { key: 'daily', label: 'Daily', color: '#00d4ff' },
    { key: 'side', label: 'Side', color: '#ffcc00' },
    { key: 'penalty', label: 'Penalty', color: '#ff003c' },
  ];

  const filtered = quests.filter((q) =>
    activeTab === 'penalty' ? q.type === 'penalty' || q.status === 'penalty' : q.type === activeTab
  );

  const completedCount = filtered.filter((q) => q.status === 'completed').length;
  const totalXp = filtered.reduce((sum, q) => (q.status === 'completed' ? sum + q.xpReward : sum), 0);

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
            Quest Board
          </div>
          <h2
            className="text-xl font-black tracking-widest font-mono"
            style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff60' }}
          >
            OPERATIONS
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-[#8888aa] font-mono">Today</div>
          <div className="text-base font-bold font-mono text-[#00ff88]">+{totalXp} XP</div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 p-1 rounded-lg bg-[#0f0f1a] border border-[#ffffff0a]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'flex-1 py-2 rounded-md text-[10px] tracking-widest font-mono font-bold uppercase transition-all duration-200',
              activeTab === tab.key ? 'bg-[#00000060]' : 'opacity-40 hover:opacity-70'
            )}
            style={{
              color: activeTab === tab.key ? tab.color : '#888888',
              boxShadow: activeTab === tab.key ? `0 0 10px ${tab.color}30` : 'none',
              borderBottom: activeTab === tab.key ? `1px solid ${tab.color}` : 'none',
            }}
          >
            {tab.label}
            {tab.key === 'penalty' && quests.filter((q) => q.type === 'penalty' || q.status === 'penalty').length > 0 && (
              <span
                className="ml-1 text-[8px] px-1 rounded"
                style={{ background: '#ff003c', color: '#fff' }}
              >
                {quests.filter((q) => q.type === 'penalty' || q.status === 'penalty').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total', value: filtered.length, color: '#8888aa' },
          { label: 'Done', value: completedCount, color: '#00ff88' },
          { label: 'Pending', value: filtered.length - completedCount, color: '#ffcc00' },
        ].map((s) => (
          <div
            key={s.label}
            className="text-center p-2 rounded-lg border border-[#ffffff0a] bg-[#0f0f1a]"
          >
            <div className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-[#8888aa] font-mono tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quest list */}
      {filtered.length === 0 ? (
        <HudCard glowColor="none">
          <div className="text-center py-8">
            <div className="text-3xl mb-3">
              {activeTab === 'penalty' ? '✅' : '📭'}
            </div>
            <div className="text-sm font-mono text-[#8888aa]">
              {activeTab === 'penalty' ? 'No penalties. Keep it that way.' : 'No quests in this category.'}
            </div>
          </div>
        </HudCard>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={() => completeQuest(quest.id)}
            />
          ))}
        </div>
      )}

      {/* Penalty reminder */}
      {activeTab === 'daily' && (
        <div
          className="rounded-lg border border-[#ff003c20] bg-[#ff003c08] p-3 text-center"
        >
          <p className="text-[10px] font-mono text-[#ff6666] tracking-wider">
            ⚠ Miss 1 day → +20% workload · Miss 3 days → rank drop · Miss 5 days → system lock
          </p>
        </div>
      )}
    </div>
  );
}
