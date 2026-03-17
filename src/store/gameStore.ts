'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Quest, BossChallenge, Screen, ChatMessage, SystemMessage, Notification } from '@/types';
import { INITIAL_PLAYER, INITIAL_QUESTS, INITIAL_BOSS, SYSTEM_MESSAGES, getXpForLevel, getRankForLevel, getAuraForLevel } from '@/lib/gameData';

interface GameState {
  // Navigation
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;

  // Player
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;

  // Quests
  quests: Quest[];
  completeQuest: (id: string) => void;
  failQuest: (id: string) => void;

  // Boss
  boss: BossChallenge;
  updateBossProgress: (amount: number) => void;

  // System Messages
  systemMessages: SystemMessage[];
  markMessageRead: (id: string) => void;
  addSystemMessage: (msg: Omit<SystemMessage, 'id' | 'timestamp' | 'read'>) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Notifications
  notification: Notification | null;
  showNotification: (notif: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotification: () => void;

  // Penalty
  penaltyActive: boolean;
  showPenaltyScreen: boolean;
  setShowPenaltyScreen: (val: boolean) => void;

  // Level up popup
  levelUpVisible: boolean;
  newLevel: number;
  setLevelUpVisible: (val: boolean, level?: number) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home',
      showSplash: true,
      setScreen: (screen) => set({ currentScreen: screen }),
      setShowSplash: (val) => set({ showSplash: val }),

      player: INITIAL_PLAYER,
      updatePlayer: (updates) => set((s) => ({ player: { ...s.player, ...updates } })),

      quests: INITIAL_QUESTS,
      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);
        if (!quest || quest.status === 'completed') return;

        const gainedXp = quest.xpReward;
        const newXp = state.player.xp + gainedXp;
        let { level, xpToNextLevel, rank, aura } = state.player;

        let remainingXp = newXp;
        let leveled = false;
        let newLevelNum = level;

        while (remainingXp >= xpToNextLevel) {
          remainingXp -= xpToNextLevel;
          level++;
          leveled = true;
          newLevelNum = level;
          xpToNextLevel = getXpForLevel(level + 1);
        }

        rank = getRankForLevel(level) as typeof rank;
        aura = getAuraForLevel(level) as typeof aura;

        set((s) => ({
          quests: s.quests.map((q) =>
            q.id === id ? { ...q, status: 'completed', completedAt: Date.now() } : q
          ),
          player: {
            ...s.player,
            xp: remainingXp,
            xpToNextLevel,
            level,
            rank,
            aura,
            totalQuestsCompleted: s.player.totalQuestsCompleted + 1,
            currentStreak: s.player.currentStreak,
          },
        }));

        if (leveled) {
          set({ levelUpVisible: true, newLevel: newLevelNum });
          get().addSystemMessage({
            type: 'levelup',
            title: `LEVEL UP — LVL ${newLevelNum}`,
            content: `You have ascended to level ${newLevelNum}. New power unlocked. The system acknowledges your growth.`,
          });
        }

        get().showNotification({
          type: 'questcomplete',
          message: `Quest complete! +${gainedXp} XP`,
        });
      },

      failQuest: (id) => {
        set((s) => ({
          quests: s.quests.map((q) =>
            q.id === id ? { ...q, status: 'failed' } : q
          ),
          penaltyActive: true,
        }));
        get().addSystemMessage({
          type: 'penalty',
          title: 'QUEST FAILED — PENALTY ACTIVATED',
          content: 'Weakness detected. A penalty protocol has been initiated. Complete the assigned punishment to continue.',
        });
      },

      boss: INITIAL_BOSS,
      updateBossProgress: (amount) => {
        set((s) => {
          const newProgress = Math.min(s.boss.progress + amount, s.boss.goal);
          const completed = newProgress >= s.boss.goal;
          return { boss: { ...s.boss, progress: newProgress, completed } };
        });
      },

      systemMessages: SYSTEM_MESSAGES,
      markMessageRead: (id) => {
        set((s) => ({
          systemMessages: s.systemMessages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          ),
        }));
      },
      addSystemMessage: (msg) => {
        set((s) => ({
          systemMessages: [
            { ...msg, id: generateId(), timestamp: Date.now(), read: false },
            ...s.systemMessages,
          ],
        }));
      },

      chatMessages: [
        {
          id: 'system-init',
          role: 'system',
          content: 'SYSTEM AI INITIALIZED. I am your performance optimization engine. Ask me anything about your training, nutrition, or strategy. I will provide cold, efficient answers.',
          timestamp: Date.now() - 300000,
        },
      ],
      addChatMessage: (msg) => {
        set((s) => ({
          chatMessages: [
            ...s.chatMessages,
            { ...msg, id: generateId(), timestamp: Date.now() },
          ],
        }));
      },

      notification: null,
      showNotification: (notif) => {
        const id = generateId();
        set({ notification: { ...notif, id, timestamp: Date.now() } });
        setTimeout(() => {
          if (get().notification?.id === id) {
            set({ notification: null });
          }
        }, 3000);
      },
      clearNotification: () => set({ notification: null }),

      penaltyActive: false,
      showPenaltyScreen: false,
      setShowPenaltyScreen: (val) => set({ showPenaltyScreen: val }),

      levelUpVisible: false,
      newLevel: 1,
      setLevelUpVisible: (val, level) => set({ levelUpVisible: val, ...(level ? { newLevel: level } : {}) }),
    }),
    {
      name: 'systemx-storage',
      partialize: (state) => ({
        player: state.player,
        quests: state.quests,
        boss: state.boss,
        chatMessages: state.chatMessages,
        systemMessages: state.systemMessages,
      }),
    }
  )
);
