'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface HudCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'red' | 'green' | 'none';
  onClick?: () => void;
  label?: string;
}

export function HudCard({ children, className, glowColor = 'blue', onClick, label }: HudCardProps) {
  const glowClass = {
    blue: 'box-glow-blue border-[#00d4ff22]',
    purple: 'box-glow-purple border-[#9d00ff22]',
    red: 'box-glow-red border-[#ff003c33]',
    green: 'box-glow-green border-[#00ff8822]',
    none: 'border-[#ffffff0d]',
  }[glowColor];

  return (
    <div
      className={clsx(
        'relative rounded-lg border bg-[#0f0f1a] p-4',
        glowClass,
        onClick && 'cursor-pointer quest-card',
        className
      )}
      onClick={onClick}
    >
      {label && (
        <div className="absolute -top-2.5 left-3 px-2 bg-[#0f0f1a] text-[10px] tracking-widest font-mono text-[#00d4ff88] uppercase">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
