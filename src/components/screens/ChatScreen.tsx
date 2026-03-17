'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { AI_RESPONSES } from '@/lib/gameData';

export function ChatScreen() {
  const { chatMessages, addChatMessage, player } = useGameStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    addChatMessage({ role: 'user', content: text });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      addChatMessage({ role: 'system', content: response });
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const QUICK_COMMANDS = [
    'Generate today\'s workout',
    'Diet plan for lean muscle',
    'How to rank up faster?',
    'Assess my weak stats',
  ];

  return (
    <div className="screen-enter flex flex-col h-screen pb-16 pt-4">
      {/* Header */}
      <div className="px-4 pb-3 border-b border-[#00d4ff10]">
        <div className="text-[9px] tracking-[4px] text-[#8888aa] font-mono uppercase mb-0.5">
          System Interface
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#00d4ff40] text-xl"
            style={{
              background: 'radial-gradient(circle, #00d4ff20, #0D0D0D)',
              boxShadow: '0 0 15px #00d4ff40',
            }}
          >
            🤖
          </div>
          <div>
            <h2
              className="text-base font-black tracking-widest font-mono"
              style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff60' }}
            >
              SYSTEM AI
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] pulse-blue" style={{ boxShadow: '0 0 6px #00ff88' }} />
              <span className="text-[9px] text-[#00ff8888] font-mono">Online · Analyzing player data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'system' && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 border border-[#00d4ff30]"
                style={{ background: 'radial-gradient(circle, #00d4ff15, #0D0D0D)' }}
              >
                🤖
              </div>
            )}
            <div
              className="max-w-[78%] rounded-xl px-3.5 py-2.5"
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #001133, #000820)'
                  : '#0f0f1a',
                border: msg.role === 'user'
                  ? '1px solid #00d4ff30'
                  : '1px solid #ffffff0a',
                boxShadow: msg.role === 'user' ? '0 0 10px #00d4ff15' : 'none',
              }}
            >
              {msg.role === 'system' && (
                <div className="text-[8px] tracking-widest text-[#00d4ff66] font-mono uppercase mb-1">
                  SYSTEM AI
                </div>
              )}
              <p
                className="text-[12px] font-mono leading-relaxed"
                style={{
                  color: msg.role === 'user' ? '#e0e0ff' : '#c0c0cc',
                  lineHeight: '1.6',
                }}
              >
                {msg.content}
              </p>
              <div className="text-right mt-1">
                <span className="text-[8px] text-[#8888aa44] font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            {msg.role === 'user' && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ml-2 border border-[#00d4ff30]"
                style={{ background: 'radial-gradient(circle, #00d4ff15, #0D0D0D)' }}
              >
                ⚔️
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm border border-[#00d4ff30]"
              style={{ background: 'radial-gradient(circle, #00d4ff15, #0D0D0D)' }}
            >
              🤖
            </div>
            <div
              className="px-4 py-3 rounded-xl border border-[#ffffff0a]"
              style={{ background: '#0f0f1a' }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                    style={{
                      animation: `aura-pulse 1.2s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick commands */}
      <div className="px-4 py-2 border-t border-[#ffffff06]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => setInput(cmd)}
              className="flex-shrink-0 px-2.5 py-1.5 rounded-lg border border-[#00d4ff20] text-[9px] font-mono text-[#00d4ff88] hover:text-[#00d4ff] hover:border-[#00d4ff40] whitespace-nowrap transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#ffffff08]">
        {player.plan === 'free' && (
          <div className="text-[9px] text-[#ff6600] font-mono text-center mb-2 tracking-wider">
            ⚡ Upgrade to Basic/Pro for unlimited AI access
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Query the system..."
            className="flex-1 bg-[#0f0f1a] border border-[#00d4ff20] rounded-xl px-4 py-3 text-[12px] font-mono text-[#e0e0ff] placeholder-[#8888aa44] outline-none focus:border-[#00d4ff50] transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl border border-[#00d4ff40] flex items-center justify-center text-lg transition-all hover:bg-[#00d4ff20] active:scale-95 disabled:opacity-30"
            style={{ boxShadow: input.trim() ? '0 0 10px #00d4ff20' : 'none' }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
