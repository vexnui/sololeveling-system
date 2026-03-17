'use client';

import { useGameStore } from '@/store/gameStore';
import type { Screen } from '@/types';
import clsx from 'clsx';

const NAV_ITEMS: { screen: Screen; label: string; icon: string }[] = [
  { screen: 'home', label: 'HQ', icon: '⬡' },
  { screen: 'quests', label: 'Quests', icon: '📋' },
  { screen: 'stats', label: 'Stats', icon: '📊' },
  { screen: 'chat', label: 'AI', icon: '🤖' },
  { screen: 'shop', label: 'Shop', icon: '🏪' },
];

export function BottomNav() {
  const { currentScreen, setScreen } = useGameStore();

  return (
    <nav className="bottom-nav pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200',
                active
                  ? 'bg-[#00d4ff15]'
                  : 'opacity-50 hover:opacity-80'
              )}
            >
              <span className={clsx('text-lg leading-none', active && 'drop-shadow-[0_0_6px_#00d4ff]')}>
                {item.icon}
              </span>
              <span
                className={clsx(
                  'text-[9px] tracking-widest font-mono uppercase',
                  active ? 'text-[#00d4ff]' : 'text-[#8888aa]'
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#00d4ff] rounded-full" style={{ boxShadow: '0 0 6px #00d4ff' }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
