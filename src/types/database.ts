export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          level?: number;
          xp?: number;
          rank?: string;
          aura?: string;
          stats_strength?: number;
          stats_endurance?: number;
          stats_discipline?: number;
          stats_agility?: number;
          stats_intelligence?: number;
          missed_days?: number;
          total_quests_completed?: number;
          longest_streak?: number;
          current_streak?: number;
          plan?: string;
          unlocked_abilities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          level?: number;
          xp?: number;
          rank?: string;
          aura?: string;
          stats_strength?: number;
          stats_endurance?: number;
          stats_discipline?: number;
          stats_agility?: number;
          stats_intelligence?: number;
          missed_days?: number;
          total_quests_completed?: number;
          longest_streak?: number;
          current_streak?: number;
          plan?: string;
          unlocked_abilities?: string[];
          updated_at?: string;
        };
      };
      quests: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          type: string;
          status?: string;
          xp_reward: number;
          category: string;
          difficulty: number;
          icon: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          type?: string;
          status?: string;
          xp_reward?: number;
          category?: string;
          difficulty?: number;
          icon?: string;
          completed_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
