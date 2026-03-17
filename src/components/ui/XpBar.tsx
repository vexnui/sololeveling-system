'use client';

import { useEffect, useState } from 'react';

interface XpBarProps {
  current: number;
  max: number;
  level: number;
  showLabel?: boolean;
}

export function XpBar({ current, max, level, showLabel = true }: XpBarProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.round((current / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] tracking-widest text-[#00d4ff] font-mono uppercase">
            LVL {level} → {level + 1}
          </span>
          <span className="text-[10px] font-mono text-[#8888aa]">
            {current.toLocaleString()} / {max.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="relative h-3 bg-[#ffffff0a] rounded-full overflow-hidden border border-[#00d4ff15]">
        <div
          className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #003366, #00d4ff, #00ffea)',
          }}
        >
          <div className="absolute inset-0 shimmer" />
        </div>
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-[#ffffff08]"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-[9px] font-mono text-[#00d4ff66]">{pct}%</span>
      </div>
    </div>
  );
}
