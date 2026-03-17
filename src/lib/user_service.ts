import { supabase } from './supabase_client';
import { getXpForLevel, getRankForLevel, getAuraForLevel } from './gameData';

// Supabase users table row shape
interface UserRow {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  rank: string;
  aura: string;
  stats_strength: number;
  stats_endurance: number;
  stats_discipline: number;
  stats_agility: number;
  stats_intelligence: number;
  missed_days: number;
  total_quests_completed: number;
  longest_streak: number;
  current_streak: number;
  plan: string;
  unlocked_abilities: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  rank: string;
  aura: string;
  stats: {
    strength: number;
    endurance: number;
    discipline: number;
    agility: number;
    intelligence: number;
  };
  missedDays: number;
  totalQuestsCompleted: number;
  longestStreak: number;
  currentStreak: number;
  plan: string;
  unlockedAbilities: string[];
  createdAt: string;
}

function rowToProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    level: row.level,
    xp: row.xp,
    rank: row.rank,
    aura: row.aura,
    stats: {
      strength: row.stats_strength,
      endurance: row.stats_endurance,
      discipline: row.stats_discipline,
      agility: row.stats_agility,
      intelligence: row.stats_intelligence,
    },
    missedDays: row.missed_days,
    totalQuestsCompleted: row.total_quests_completed,
    longestStreak: row.longest_streak,
    currentStreak: row.current_streak,
    plan: row.plan,
    unlockedAbilities: row.unlocked_abilities ?? [],
    createdAt: row.created_at,
  };
}

// Fetch user profile by auth user id
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return rowToProfile(data);
}

// Create new user profile after signup / onboarding
export async function createUserProfile(
  userId: string,
  username: string,
  email: string
): Promise<UserProfile | null> {
  const insert = {
    id: userId,
    username,
    email,
    level: 1,
    xp: 0,
    rank: 'E',
    aura: 'white',
    stats_strength: 10,
    stats_endurance: 10,
    stats_discipline: 10,
    stats_agility: 10,
    stats_intelligence: 10,
    missed_days: 0,
    total_quests_completed: 0,
    longest_streak: 0,
    current_streak: 0,
    plan: 'free',
    unlocked_abilities: [],
  };

  const { data, error } = await supabase
    .from('users')
    .insert(insert)
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating user profile:', error);
    return null;
  }
  return rowToProfile(data);
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    username: string;
    level: number;
    xp: number;
    rank: string;
    aura: string;
    stats_strength: number;
    stats_endurance: number;
    stats_discipline: number;
    stats_agility: number;
    stats_intelligence: number;
    missed_days: number;
    total_quests_completed: number;
    longest_streak: number;
    current_streak: number;
    plan: string;
    unlocked_abilities: string[];
  }>
): Promise<UserProfile | null> {
  const updatePayload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', userId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating user profile:', error);
    return null;
  }
  return rowToProfile(data);
}

// Add XP and handle level-up logic
export async function addXpToUser(
  userId: string,
  currentLevel: number,
  currentXp: number,
  xpToAdd: number
): Promise<{ newLevel: number; newXp: number; leveled: boolean; newRank: string; newAura: string }> {
  let level = currentLevel;
  let xp = currentXp + xpToAdd;
  let xpToNextLevel = getXpForLevel(level + 1);
  let leveled = false;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    leveled = true;
    xpToNextLevel = getXpForLevel(level + 1);
  }

  const newRank = getRankForLevel(level);
  const newAura = getAuraForLevel(level);

  await updateUserProfile(userId, {
    level,
    xp,
    rank: newRank,
    aura: newAura,
  });

  return { newLevel: level, newXp: xp, leveled, newRank, newAura };
}

// Increment total quests completed
export async function incrementQuestsCompleted(
  userId: string,
  current: number
): Promise<void> {
  await updateUserProfile(userId, {
    total_quests_completed: current + 1,
  });
}

// Check if user profile already exists
export async function userProfileExists(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();
  return !!data;
}
