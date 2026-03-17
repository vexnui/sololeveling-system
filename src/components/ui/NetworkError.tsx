'use client';

import { useState, useEffect } from 'react';
import type { NetworkStatus } from '@/context/AuthContext';

interface NetworkErrorProps {
  status: NetworkStatus;
}

export function NetworkError({ status }: NetworkErrorProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status !== 'offline' && status !== 'reconnecting') return;

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setRetryCount((r) => r + 1);
          return 5;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, retryCount]);

  if (status === 'online') return null;

  const isReconnecting = status === 'reconnecting';

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[600] px-4 pt-3"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="rounded-xl border px-4 py-3 flex items-center gap-3 notif-slide-in"
        style={{
          background: isReconnecting ? '#0a0a00' : '#0a0000',
          borderColor: isReconnecting ? '#ffcc0040' : '#ff003c40',
          boxShadow: isReconnecting ? '0 0 20px #ffcc0015' : '0 0 20px #ff003c15',
        }}
      >
        {/* Pulsing icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 retry-pulse"
          style={{
            background: isReconnecting ? '#ffcc0015' : '#ff003c15',
            border: `1px solid ${isReconnecting ? '#ffcc0040' : '#ff003c40'}`,
          }}
        >
          <span className="text-sm">{isReconnecting ? '⟳' : '✕'}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-mono font-bold tracking-[3px] uppercase"
            style={{ color: isReconnecting ? '#ffcc00' : '#ff003c' }}
          >
            {isReconnecting ? 'RECONNECTING...' : 'SYSTEM ERROR'}
          </p>
          <p className="text-[9px] font-mono mt-0.5 tracking-wider"
            style={{ color: isReconnecting ? '#ffcc0077' : '#ff666677' }}>
            {isReconnecting
              ? `Restoring connection... retry in ${countdown}s`
              : 'Network offline. Reconnecting automatically...'}
          </p>
        </div>

        {/* Spinner */}
        <div
          className="w-4 h-4 rounded-full border-2 border-t-transparent flex-shrink-0"
          style={{
            borderColor: isReconnecting ? '#ffcc0060' : '#ff003c60',
            borderTopColor: 'transparent',
            animation: 'aura-rotate 1s linear infinite',
          }}
        />
      </div>
    </div>
  );
}
