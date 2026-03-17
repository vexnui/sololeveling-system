'use client';

import { RANK_COLORS } from '@/lib/gameData';
import type { Rank } from '@/types';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const color = RANK_COLORS[rank] || '#888888';
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  return (
    <span
      className={`font-mono font-bold tracking-widest rounded ${sizeClasses} border`}
      style={{
        color,
        borderColor: `${color}55`,
        background: `${color}11`,
        textShadow: `0 0 10px ${color}80`,
        boxShadow: `0 0 8px ${color}30`,
      }}
    >
      [{rank}]
    </span>
  );
}
