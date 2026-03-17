import { supabase } from './supabase_client';
import { INITIAL_QUESTS } from './gameData';

interface QuestRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  xp_reward: number;
  category: string;
  difficulty: number;
  icon: string;
  completed_at: string | null;
  created_at: string;
}

export interface DbQuest {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'daily' | 'side' | 'penalty' | 'boss';
  status: 'pending' | 'completed' | 'failed' | 'penalty';
  xpReward: number;
  category: 'fitness' | 'productivity' | 'lifestyle' | 'boss';
  difficulty: 1 | 2 | 3 | 4 | 5;
  icon: string;
  completedAt: string | null;
  createdAt: string;
}

function rowToQuest(row: QuestRow): DbQuest {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    type: row.type as DbQuest['type'],
    status: row.status as DbQuest['status'],
    xpReward: row.xp_reward,
    category: row.category as DbQuest['category'],
    difficulty: row.difficulty as DbQuest['difficulty'],
    icon: row.icon,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

// Get all quests for a user
export async function getUserQuests(userId: string): Promise<DbQuest[]> {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching quests:', error);
    return [];
  }
  return data.map(rowToQuest);
}

// Seed default daily quests for a new user
export async function seedDefaultQuestsForUser(userId: string): Promise<DbQuest[]> {
  const questsToInsert = INITIAL_QUESTS.map((q) => ({
    user_id: userId,
    title: q.title,
    description: q.description,
    type: q.type,
    status: 'pending',
    xp_reward: q.xpReward,
    category: q.category,
    difficulty: q.difficulty,
    icon: q.icon,
    completed_at: null,
  }));

  const { data, error } = await supabase
    .from('quests')
    .insert(questsToInsert)
    .select();

  if (error || !data) {
    console.error('Error seeding quests:', error);
    return [];
  }
  return data.map(rowToQuest);
}

// Complete a quest
export async function completeQuest(questId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('quests')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', questId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error completing quest:', error);
    return false;
  }
  return true;
}

// Fail a quest
export async function failQuest(questId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('quests')
    .update({ status: 'failed' })
    .eq('id', questId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error failing quest:', error);
    return false;
  }
  return true;
}

// Insert a penalty quest
export async function insertPenaltyQuest(userId: string, originalQuestTitle: string): Promise<DbQuest | null> {
  const insert = {
    user_id: userId,
    title: `PENALTY: Double ${originalQuestTitle}`,
    description: `You failed your task. This is your punishment. Complete or face rank reduction.`,
    type: 'penalty',
    status: 'penalty',
    xp_reward: 0,
    category: 'fitness',
    difficulty: 4,
    icon: '⚠️',
    completed_at: null,
  };

  const { data, error } = await supabase
    .from('quests')
    .insert(insert)
    .select()
    .single();

  if (error || !data) {
    console.error('Error inserting penalty quest:', error);
    return null;
  }
  return rowToQuest(data);
}

// Check if user has any quests seeded
export async function hasQuestsSeeded(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('quests')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  return Array.isArray(data) && data.length > 0;
}
