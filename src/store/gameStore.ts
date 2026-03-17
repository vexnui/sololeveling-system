'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Quest, BossChallenge, Screen, ChatMessage, SystemMessage, Notification } from '@/types';
import { INITIAL_PLAYER, INITIAL_QUESTS, INITIAL_BOSS, SYSTEM_MESSAGES, getXpForLevel, getRankForLevel, getAuraForLevel } from '@/lib/gameData';
import { updateUserProfile, addXpToUser, incrementQuestsCompleted } from '@/lib/user_service';
import { completeQuest as dbCompleteQuest, failQuest as dbFailQuest, insertPenaltyQuest } from '@/lib/quest_service';
import type { UserProfile } from '@/lib/user_service';
import type { DbQuest } from '@/lib/quest_service';

interface GameState {
  // Navigation
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;

  // Auth user id (set after login)
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Player
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;
  loadPlayerFromProfile: (profile: UserProfile) => void;

  // Quests
  quests: Quest[];
  loadQuestsFromDb: (dbQuests: DbQuest[]) => void;
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

function dbQuestToLocal(q: DbQuest): Quest {
  return {
    id: q.id,
    title: q.title,
    description: q.description,
    type: q.type,
    status: q.status,
    xpReward: q.xpReward,
    category: q.category,
    difficulty: q.difficulty,
    icon: q.icon,
    completedAt: q.completedAt ? new Date(q.completedAt).getTime() : undefined,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home',
      showSplash: true,
      setScreen: (screen) => set({ currentScreen: screen }),
      setShowSplash: (val) => set({ showSplash: val }),

      userId: null,
      setUserId: (id) => set({ userId: id }),

      player: INITIAL_PLAYER,
      updatePlayer: (updates) => set((s) => ({ player: { ...s.player, ...updates } })),
      loadPlayerFromProfile: (profile: UserProfile) => {
        set({
          player: {
            name: profile.username,
            level: profile.level,
            rank: profile.rank as Player['rank'],
            xp: profile.xp,
            xpToNextLevel: getXpForLevel(profile.level + 1),
            aura: profile.aura as Player['aura'],
            stats: profile.stats,
            missedDays: profile.missedDays,
            totalQuestsCompleted: profile.totalQuestsCompleted,
            longestStreak: profile.longestStreak,
            currentStreak: profile.currentStreak,
            joinedAt: new Date(profile.createdAt).getTime(),
            plan: profile.plan as Player['plan'],
            unlockedAbilities: profile.unlockedAbilities,
          },
        });
      },

      quests: INITIAL_QUESTS,
      loadQuestsFromDb: (dbQuests: DbQuest[]) => {
        set({ quests: dbQuests.map(dbQuestToLocal) });
      },

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);
        if (!quest || quest.status === 'completed') return;

        const gainedXp = quest.xpReward;

        // Optimistic local update first
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

        // Sync to Supabase in background
        const userId = state.userId;
        if (userId) {
          dbCompleteQuest(id, userId).catch(console.error);
          addXpToUser(userId, state.player.level, state.player.xp, gainedXp).catch(console.error);
          incrementQuestsCompleted(userId, state.player.totalQuestsCompleted).catch(console.error);
        }
      },

      failQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);

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

        // Sync to Supabase
        const userId = state.userId;
        if (userId && quest) {
          dbFailQuest(id, userId).catch(console.error);
          insertPenaltyQuest(userId, quest.title).then((penaltyQuest) => {
            if (penaltyQuest) {
              set((s) => ({
                quests: [...s.quests, dbQuestToLocal(penaltyQuest)],
              }));
            }
          }).catch(console.error);
        }
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
        boss: state.boss,
        chatMessages: state.chatMessages,
        systemMessages: state.systemMessages,
        // Note: quests now come from Supabase, not persisted locally
      }),
    }
  )
);
