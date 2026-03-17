'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export function NotificationToast() {
  const { notification, clearNotification } = useGameStore();

  useEffect(() => {
    if (notification) {
      const t = setTimeout(clearNotification, 3000);
      return () => clearTimeout(t);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const configs = {
    questcomplete: { bg: '#00ff8820', border: '#00ff8840', text: '#00ff88', prefix: '✓ QUEST COMPLETE' },
    levelup: { bg: '#9d00ff20', border: '#9d00ff40', text: '#9d00ff', prefix: '⬆ LEVEL UP' },
    penalty: { bg: '#ff003c20', border: '#ff003c40', text: '#ff003c', prefix: '⚠ PENALTY' },
    boss: { bg: '#ffcc0020', border: '#ffcc0040', text: '#ffcc00', prefix: '⚔ BOSS CHALLENGE' },
    warning: { bg: '#ff660020', border: '#ff660040', text: '#ff6600', prefix: '! WARNING' },
  };
  const cfg = configs[notification.type] || configs.questcomplete;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] max-w-[360px] w-[90%] rounded-lg border px-4 py-3 screen-enter"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <p className="text-[10px] tracking-widest font-mono font-bold" style={{ color: cfg.text }}>
        {cfg.prefix}
      </p>
      <p className="text-sm font-mono text-[#e0e0ff] mt-0.5">{notification.message}</p>
    </div>
  );
}
