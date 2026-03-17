'use client';

import { useEffect, useState } from 'react';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  icon?: string;
}

export function StatBar({ label, value, max = 100, color = '#00d4ff', icon }: StatBarProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.round((value / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-[11px] tracking-widest font-mono uppercase" style={{ color }}>
            {label}
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="relative h-2 bg-[#ffffff08] rounded-full overflow-hidden border border-[#ffffff08]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out stat-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}44, ${color})`,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}
