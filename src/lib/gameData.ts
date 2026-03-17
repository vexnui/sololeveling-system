import type { Quest, Player, BossChallenge, LeaderboardEntry, ShopItem, SystemMessage } from '@/types';

export const RANK_ORDER: string[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
export const RANK_COLORS: Record<string, string> = {
  E: '#888888',
  D: '#00ff88',
  C: '#00d4ff',
  B: '#4488ff',
  A: '#9d00ff',
  S: '#ffcc00',
  SS: '#ff6600',
  SSS: '#ff003c',
};
export const RANK_THRESHOLDS: Record<string, number> = {
  E: 1, D: 10, C: 20, B: 35, A: 50, S: 70, SS: 85, SSS: 99,
};
export const AURA_COLORS: Record<string, string> = {
  white: '#ffffff',
  blue: '#00d4ff',
  purple: '#9d00ff',
  red: '#ff003c',
  gold: '#ffcc00',
};
export const AURA_THRESHOLDS: Record<string, number> = {
  white: 1, blue: 20, purple: 40, red: 70, gold: 90,
};

export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function getRankForLevel(level: number): string {
  let rank = 'E';
  for (const [r, threshold] of Object.entries(RANK_THRESHOLDS)) {
    if (level >= threshold) rank = r;
  }
  return rank;
}

export function getAuraForLevel(level: number): string {
  let aura = 'white';
  for (const [a, threshold] of Object.entries(AURA_THRESHOLDS)) {
    if (level >= threshold) aura = a;
  }
  return aura;
}

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1', title: '100 Push-Ups', description: 'Complete 100 push-ups in total today. Rest between sets.',
    type: 'daily', status: 'pending', xpReward: 150, category: 'fitness', difficulty: 3, icon: '💪'
  },
  {
    id: 'q2', title: '5km Morning Run', description: 'Run at least 5 kilometers before noon.',
    type: 'daily', status: 'pending', xpReward: 200, category: 'fitness', difficulty: 3, icon: '🏃'
  },
  {
    id: 'q3', title: '30-Min Meditation', description: 'Sit in silence. Focus on your breath. No distractions.',
    type: 'daily', status: 'completed', xpReward: 100, category: 'lifestyle', difficulty: 2, icon: '🧘',
    completedAt: Date.now() - 3600000
  },
  {
    id: 'q4', title: 'Read 20 Pages', description: 'Read a non-fiction book or educational material.',
    type: 'daily', status: 'pending', xpReward: 80, category: 'productivity', difficulty: 1, icon: '📚'
  },
  {
    id: 'q5', title: '50 Squats', description: 'Complete 50 deep squats with proper form.',
    type: 'daily', status: 'pending', xpReward: 100, category: 'fitness', difficulty: 2, icon: '🦵'
  },
  {
    id: 'q6', title: 'Cold Shower', description: 'Take a 3-minute cold shower. No warm water.',
    type: 'side', status: 'pending', xpReward: 50, category: 'lifestyle', difficulty: 1, icon: '🚿'
  },
  {
    id: 'q7', title: 'Clean Your Space', description: 'Organize your room, desk, and environment. Chaos = weakness.',
    type: 'side', status: 'completed', xpReward: 60, category: 'lifestyle', difficulty: 1, icon: '🧹',
    completedAt: Date.now() - 7200000
  },
  {
    id: 'q8', title: 'Meal Prep for the Day', description: 'Prepare all 3 meals in advance. Control your nutrition.',
    type: 'side', status: 'pending', xpReward: 75, category: 'productivity', difficulty: 2, icon: '🍱'
  },
  {
    id: 'q9', title: 'PENALTY: Double Push-Ups', description: 'You failed yesterday. Complete 200 push-ups as penalty.',
    type: 'penalty', status: 'penalty', xpReward: 0, category: 'fitness', difficulty: 4, icon: '⚠️'
  },
];

export const INITIAL_BOSS: BossChallenge = {
  id: 'boss1',
  title: 'IRON WILL PROTOCOL',
  description: 'The system demands absolute dedication. Complete 500 push-ups within 7 days.',
  target: '500 Push-Ups',
  progress: 215,
  goal: 500,
  unit: 'push-ups',
  endsAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
  xpReward: 2000,
  rankBoost: true,
  penaltyXp: 500,
  completed: false,
  failed: false,
};

export const INITIAL_PLAYER: Player = {
  name: 'PLAYER_001',
  level: 23,
  rank: 'C',
  xp: 1450,
  xpToNextLevel: getXpForLevel(24),
  aura: 'blue',
  stats: { strength: 67, endurance: 54, discipline: 78, agility: 45, intelligence: 82 },
  missedDays: 0,
  totalQuestsCompleted: 147,
  longestStreak: 21,
  currentStreak: 8,
  joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  plan: 'pro',
  unlockedAbilities: ['iron_will', 'pain_resistance', 'focus_burst'],
};

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'SHADOW_MONARCH', level: 99, playerRank: 'SSS', xp: 99999, aura: 'gold' },
  { rank: 2, name: 'VOIDWALKER_X', level: 87, playerRank: 'SS', xp: 78432, aura: 'red' },
  { rank: 3, name: 'CRIMSON_BLADE', level: 74, playerRank: 'S', xp: 61205, aura: 'red' },
  { rank: 4, name: 'NEXUS_99', level: 65, playerRank: 'A', xp: 48900, aura: 'purple' },
  { rank: 5, name: 'IRONCLAD_V', level: 56, playerRank: 'A', xp: 38200, aura: 'purple' },
  { rank: 6, name: 'GHOST_PROTOCOL', level: 48, playerRank: 'B', xp: 29100, aura: 'blue' },
  { rank: 7, name: 'APEX_HUNTER', level: 41, playerRank: 'B', xp: 22500, aura: 'blue' },
  { rank: 8, name: 'STEALTH_MODE', level: 35, playerRank: 'C', xp: 17800, aura: 'blue' },
  { rank: 9, name: 'CIPHER_7', level: 29, playerRank: 'C', xp: 13200, aura: 'blue' },
  { rank: 10, name: 'PLAYER_001', level: 23, playerRank: 'C', xp: 9450, aura: 'blue', isCurrentUser: true },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'dumbbell_set', name: 'Iron Dumbbell Set', description: '5kg-20kg adjustable dumbbells. Build your arsenal.', price: 2499, currency: 'inr', category: 'equipment', icon: '🏋️', owned: false },
  { id: 'pull_bar', name: 'Door Pull-Up Bar', description: 'No-screw installation. Max load 150kg.', price: 999, currency: 'inr', category: 'equipment', icon: '🪢', owned: false },
  { id: 'resistance_bands', name: 'Resistance Band Set', description: '5 resistance levels. Portable training system.', price: 599, currency: 'inr', category: 'equipment', icon: '💢', owned: true },
  { id: 'skin_crimson', name: 'Crimson Aura Skin', description: 'Unlock the crimson UI theme. High rank energy.', price: 500, currency: 'xp', category: 'skin', icon: '🔴', owned: false },
  { id: 'skin_void', name: 'Void Theme', description: 'Pure black. Absolute darkness.', price: 800, currency: 'xp', category: 'skin', icon: '⬛', owned: false },
  { id: 'xp_boost_2x', name: 'XP Booster 2x', description: 'Double XP from all quests for 24 hours.', price: 200, currency: 'xp', category: 'booster', icon: '⚡', owned: false },
  { id: 'xp_boost_5x', name: 'XP Booster 5x', description: '5x XP for 1 hour. Maximum output mode.', price: 500, currency: 'xp', category: 'booster', icon: '⚡⚡', owned: false },
  { id: 'penalty_shield', name: 'Penalty Shield', description: 'Block one penalty event. Use wisely.', price: 1000, currency: 'xp', category: 'booster', icon: '🛡️', owned: false },
];

export const SYSTEM_MESSAGES: SystemMessage[] = [
  { id: 'msg1', type: 'warning', title: 'QUEST DEADLINE APPROACHING', content: 'Daily quests expire in 3 hours. You have 3 incomplete tasks. The system is watching.', timestamp: Date.now() - 600000, read: false },
  { id: 'msg2', type: 'success', title: 'STREAK MAINTAINED', content: 'Day 8 streak active. Your discipline stat has increased by +2. Do not break now.', timestamp: Date.now() - 3600000, read: true },
  { id: 'msg3', type: 'info', title: 'WEEKLY BOSS PROGRESS', content: 'Iron Will Protocol: 215/500 push-ups. 4 days remaining. Accelerate your pace.', timestamp: Date.now() - 7200000, read: true },
  { id: 'msg4', type: 'levelup', title: 'LEVEL UP — LVL 23', content: 'You have ascended. Strength +3, Endurance +2. New challenge protocols unlocked.', timestamp: Date.now() - 86400000, read: true },
];

export const ABILITIES = [
  { id: 'iron_will', name: 'Iron Will', description: 'Penalty workouts deal -25% extra volume.', icon: '🔩', stat: 'discipline', req: 60 },
  { id: 'pain_resistance', name: 'Pain Resistance', description: 'Endurance quests give +10% XP.', icon: '🩸', stat: 'endurance', req: 40 },
  { id: 'focus_burst', name: 'Focus Burst', description: 'Productivity tasks complete faster.', icon: '🧠', stat: 'intelligence', req: 70 },
  { id: 'berserker', name: 'Berserker', description: 'Strength quests give double XP when streak > 7.', icon: '🪓', stat: 'strength', req: 80 },
  { id: 'shadow_step', name: 'Shadow Step', description: 'Allows 1 quest skip per week without penalty.', icon: '👤', stat: 'agility', req: 75 },
  { id: 'ruler_authority', name: "Ruler's Authority", description: 'All stats passively increase each week.', icon: '👑', stat: 'discipline', req: 90 },
];

export const AI_RESPONSES: string[] = [
  "ANALYSIS COMPLETE. Your performance metrics indicate suboptimal recovery. Recommend: 8 hours sleep, protein intake 2g/kg bodyweight.",
  "SYSTEM ALERT: You have been inactive for 2 hours. Initiating movement protocol. Complete 20 jumping jacks NOW.",
  "WORKOUT PLAN GENERATED: Monday — Chest/Triceps. Tuesday — Back/Biceps. Wednesday — Legs. Thursday — Shoulders. Friday — Full Body. Weekend — Active Recovery.",
  "NUTRITION PROTOCOL: Morning: High protein breakfast. Post-workout: 30g whey + banana. Evening: Complex carbs + lean protein. Eliminate processed sugars.",
  "STRENGTH ASSESSMENT: Current trajectory will bring you to Rank B in approximately 47 days if streak is maintained. Do not falter.",
  "DETECTED: Low discipline score. Penalty protocols will activate if you miss another task. The system shows no mercy to the weak.",
  "PROGRESS REPORT: This week you burned approximately 2,400 extra calories through quest completion. Your consistency puts you in top 12% globally.",
];
