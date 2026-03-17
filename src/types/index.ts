export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
export type AuraColor = 'white' | 'blue' | 'purple' | 'red' | 'gold';
export type QuestStatus = 'pending' | 'completed' | 'failed' | 'penalty';
export type QuestType = 'daily' | 'side' | 'penalty' | 'boss';
export type Screen = 'splash' | 'home' | 'quests' | 'stats' | 'boss' | 'social' | 'aura' | 'chat' | 'shop' | 'penalty';
export type PlanTier = 'free' | 'basic' | 'pro';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  xpReward: number;
  category: 'fitness' | 'productivity' | 'lifestyle' | 'boss';
  difficulty: 1 | 2 | 3 | 4 | 5;
  completedAt?: number;
  icon: string;
}

export interface PlayerStats {
  strength: number;
  endurance: number;
  discipline: number;
  agility: number;
  intelligence: number;
}

export interface Player {
  name: string;
  level: number;
  rank: Rank;
  xp: number;
  xpToNextLevel: number;
  aura: AuraColor;
  stats: PlayerStats;
  missedDays: number;
  totalQuestsCompleted: number;
  longestStreak: number;
  currentStreak: number;
  joinedAt: number;
  plan: PlanTier;
  unlockedAbilities: string[];
}

export interface BossChallenge {
  id: string;
  title: string;
  description: string;
  target: string;
  progress: number;
  goal: number;
  unit: string;
  endsAt: number;
  xpReward: number;
  rankBoost: boolean;
  penaltyXp: number;
  completed: boolean;
  failed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  playerRank: Rank;
  xp: number;
  aura: AuraColor;
  isCurrentUser?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'xp' | 'inr';
  category: 'equipment' | 'skin' | 'booster';
  icon: string;
  owned: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user';
  content: string;
  timestamp: number;
}

export interface SystemMessage {
  id: string;
  type: 'warning' | 'info' | 'success' | 'penalty' | 'levelup';
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'levelup' | 'questcomplete' | 'penalty' | 'boss' | 'warning';
  message: string;
  timestamp: number;
}
