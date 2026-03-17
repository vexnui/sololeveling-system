'use client';

import { useState } from 'react';
import { HudCard } from '@/components/ui/HudCard';
import { SHOP_ITEMS } from '@/lib/gameData';
import { useGameStore } from '@/store/gameStore';
import type { ShopItem } from '@/types';
import clsx from 'clsx';

type Category = 'all' | 'equipment' | 'skin' | 'booster';

function ShopItemCard({ item, onBuy }: { item: ShopItem; onBuy: () => void }) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-3.5 transition-all',
        item.owned ? 'border-[#00ff8825] bg-[#00ff8808]' : 'border-[#ffffff0a] bg-[#0f0f1a] quest-card'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
          style={{
            borderColor: item.owned ? '#00ff8830' : '#00d4ff20',
            background: '#050510',
          }}
        >
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold font-mono text-[#e0e0ff]">{item.name}</h3>
            {item.owned && (
              <span className="text-[9px] font-mono text-[#00ff88] tracking-wider">OWNED</span>
            )}
          </div>
          <p className="text-[10px] text-[#8888aa] font-mono mt-0.5 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div
              className="text-sm font-bold font-mono"
              style={{
                color: item.currency === 'xp' ? '#9d00ff' : '#00d4ff',
              }}
            >
              {item.currency === 'inr' ? '₹' : ''}{item.price.toLocaleString()}
              <span className="text-[9px] ml-1 font-normal opacity-60">
                {item.currency === 'xp' ? 'XP' : 'INR'}
              </span>
            </div>
            {!item.owned && (
              <button
                onClick={onBuy}
                className="px-3 py-1.5 rounded-lg border font-mono text-[9px] font-bold tracking-widest transition-all hover:opacity-80 active:scale-95"
                style={{
                  color: item.currency === 'inr' ? '#00d4ff' : '#9d00ff',
                  borderColor: item.currency === 'inr' ? '#00d4ff40' : '#9d00ff40',
                  boxShadow: `0 0 8px ${item.currency === 'inr' ? '#00d4ff20' : '#9d00ff20'}`,
                }}
              >
                {item.currency === 'inr' ? 'BUY' : 'REDEEM'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { player, showNotification } = useGameStore();

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '◈' },
    { key: 'equipment', label: 'Equipment', icon: '🏋️' },
    { key: 'skin', label: 'Skins', icon: '🎨' },
    { key: 'booster', label: 'Boosters', icon: '⚡' },
  ];

  const filtered = activeCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((i) => i.category === activeCategory);

  const plans = [
    {
      name: 'FREE',
      price: '₹0',
      color: '#8888aa',
      features: ['Basic daily quests', 'Leveling system', 'Global leaderboard'],
      current: player.plan === 'free',
    },
    {
      name: 'BASIC',
      price: '₹50/mo',
      color: '#00d4ff',
      features: ['AI workout + diet', 'Progress photo upload', 'Chat with 5 players', 'Real-life task XP'],
      current: player.plan === 'basic',
    },
    {
      name: 'PRO',
      price: '₹150/mo',
      color: '#9d00ff',
      features: ['Anime character mode', 'Unlimited chat', 'Full aura system', 'Marketplace access', 'Real consequence mode'],
      current: player.plan === 'pro',
    },
  ];

  return (
    <div className="screen-enter pb-24 pt-4 px-4 space-y-4 min-h-screen">
      {/* Header */}
      <div>
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          System Marketplace
        </div>
        <h2
          className="text-xl font-black tracking-widest font-mono"
          style={{ color: '#00d4ff', textShadow: '0 0 15px #00d4ff60' }}
        >
          SHOP
        </h2>
      </div>

      {/* Player XP balance */}
      <div
        className="flex items-center justify-between rounded-lg border border-[#9d00ff25] bg-[#9d00ff08] px-4 py-3"
      >
        <div>
          <div className="text-[9px] text-[#8888aa] font-mono tracking-wider uppercase">Available XP</div>
          <div
            className="text-xl font-black font-mono"
            style={{ color: '#9d00ff', textShadow: '0 0 10px #9d00ff80' }}
          >
            {player.xp.toLocaleString()} XP
          </div>
        </div>
        <div className="text-3xl">💎</div>
      </div>

      {/* Subscription Plans */}
      <div>
        <div className="text-[9px] tracking-[3px] text-[#8888aa] font-mono uppercase mb-2">
          SUBSCRIPTION PLANS
        </div>
        <div className="grid grid-cols-3 gap-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl border p-3 text-center relative overflow-hidden"
              style={{
                borderColor: plan.current ? `${plan.color}50` : `${plan.color}20`,
                background: plan.current
                  ? `linear-gradient(135deg, ${plan.color}10, ${plan.color}05)`
                  : '#0f0f1a',
                boxShadow: plan.current ? `0 0 20px ${plan.color}25` : 'none',
              }}
            >
              {plan.current && (
                <div
                  className="absolute top-0 left-0 right-0 text-[7px] py-0.5 text-center font-mono font-bold tracking-widest"
                  style={{ background: plan.color, color: '#000' }}
                >
                  ACTIVE
                </div>
              )}
              <div className="mt-2">
                <div className="text-[10px] font-black font-mono tracking-widest" style={{ color: plan.color }}>
                  {plan.name}
                </div>
                <div className="text-sm font-bold font-mono text-[#e0e0ff] mt-1">{plan.price}</div>
              </div>
              <ul className="mt-2 space-y-0.5 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="text-[8px] text-[#8888aa] font-mono flex items-start gap-1">
                    <span style={{ color: plan.color }}>·</span> {f}
                  </li>
                ))}
              </ul>
              {!plan.current && plan.name !== 'FREE' && (
                <button
                  onClick={() => showNotification({ type: 'questcomplete', message: `Redirecting to ${plan.name} plan...` })}
                  className="mt-3 w-full py-1.5 rounded-lg text-[8px] font-bold font-mono tracking-widest transition-all active:scale-95"
                  style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}40` }}
                >
                  UPGRADE
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-lg border text-[9px] font-mono font-bold tracking-wider uppercase transition-all',
              activeCategory === cat.key
                ? 'border-[#00d4ff40] bg-[#00d4ff15] text-[#00d4ff]'
                : 'border-[#ffffff0a] bg-[#0f0f1a] text-[#8888aa] hover:text-[#00d4ff]'
            )}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            onBuy={() => showNotification({ type: 'questcomplete', message: `Processing purchase: ${item.name}` })}
          />
        ))}
      </div>
    </div>
  );
}
