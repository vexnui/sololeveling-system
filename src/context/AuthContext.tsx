'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase_client';
import { getUserProfile, userProfileExists } from '@/lib/user_service';
import { getUserQuests, seedDefaultQuestsForUser } from '@/lib/quest_service';
import type { UserProfile } from '@/lib/user_service';
import type { DbQuest } from '@/lib/quest_service';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
export type AppState = 'booting' | 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';
export type NetworkStatus = 'online' | 'offline' | 'reconnecting';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  appState: AppState;
  networkStatus: NetworkStatus;
  userProfile: UserProfile | null;
  dbQuests: DbQuest[];
  refreshProfile: () => Promise<void>;
  refreshQuests: () => Promise<void>;
  handleOnboardingComplete: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  setDbQuests: React.Dispatch<React.SetStateAction<DbQuest[]>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────
// Provider
// ─────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appState, setAppState] = useState<AppState>('booting');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dbQuests, setDbQuests] = useState<DbQuest[]>([]);

  // Track real-time subscription to avoid duplicates
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Network monitoring ──────────────────
  useEffect(() => {
    function goOnline() {
      setNetworkStatus('online');
    }
    function goOffline() {
      setNetworkStatus('offline');
    }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ── Real-time subscription for user profile ──
  const subscribeToProfile = useCallback((userId: string) => {
    // Clean up any existing channel
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    const channel = supabase
      .channel(`user-profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          // Map snake_case DB row → UserProfile shape
          const row = payload.new as Record<string, unknown>;
          if (!row) return;
          setUserProfile({
            id: row.id as string,
            username: row.username as string,
            email: row.email as string,
            level: row.level as number,
            xp: row.xp as number,
            rank: row.rank as string,
            aura: row.aura as string,
            stats: {
              strength: row.stats_strength as number,
              endurance: row.stats_endurance as number,
              discipline: row.stats_discipline as number,
              agility: row.stats_agility as number,
              intelligence: row.stats_intelligence as number,
            },
            missedDays: row.missed_days as number,
            totalQuestsCompleted: row.total_quests_completed as number,
            longestStreak: row.longest_streak as number,
            currentStreak: row.current_streak as number,
            plan: row.plan as string,
            unlockedAbilities: (row.unlocked_abilities as string[]) ?? [],
            createdAt: row.created_at as string,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quests',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Re-fetch full quests list on any change
          const quests = await getUserQuests(userId);
          setDbQuests(quests);
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setNetworkStatus('reconnecting');
        } else if (status === 'SUBSCRIBED') {
          setNetworkStatus('online');
        }
      });

    realtimeChannelRef.current = channel;
  }, []);

  // ── Load profile + quests ────────────────
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profile = await getUserProfile(user.id);
    if (profile) setUserProfile(profile);
  }, [user]);

  const refreshQuests = useCallback(async () => {
    if (!user) return;
    const quests = await getUserQuests(user.id);
    setDbQuests(quests);
  }, [user]);

  // ── Init after auth ──────────────────────
  const initUserSession = useCallback(async (authUser: User) => {
    setUser(authUser);
    setAppState('loading');

    try {
      const exists = await userProfileExists(authUser.id);
      if (!exists) {
        setAppState('onboarding');
        return;
      }

      const [profile, quests] = await Promise.all([
        getUserProfile(authUser.id),
        getUserQuests(authUser.id),
      ]);

      setUserProfile(profile);

      if (quests.length === 0) {
        const seeded = await seedDefaultQuestsForUser(authUser.id);
        setDbQuests(seeded);
      } else {
        setDbQuests(quests);
      }

      // Start real-time subscription
      subscribeToProfile(authUser.id);

      setAppState('authenticated');
    } catch {
      // Network error during init — stay in loading with offline indicator
      setNetworkStatus('offline');
      setAppState('unauthenticated');
    }
  }, [subscribeToProfile]);

  // ── Onboarding complete ──────────────────
  const handleOnboardingComplete = useCallback(async (username: string) => {
    if (!user) return;
    void username;
    const [profile, quests] = await Promise.all([
      getUserProfile(user.id),
      getUserQuests(user.id),
    ]);
    setUserProfile(profile);
    setDbQuests(quests);
    subscribeToProfile(user.id);
    setAppState('authenticated');
  }, [user, subscribeToProfile]);

  // ── Bootstrap ───────────────────────────
  useEffect(() => {
    // Boot delay for the system boot screen effect
    const bootTimer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setSession(data.session);
        initUserSession(data.session.user);
      } else {
        setAppState('unauthenticated');
      }
    }, 2200); // minimum boot screen display time

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        initUserSession(newSession.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setDbQuests([]);
        if (realtimeChannelRef.current) {
          supabase.removeChannel(realtimeChannelRef.current);
          realtimeChannelRef.current = null;
        }
        setAppState('unauthenticated');
      }
    });

    return () => {
      clearTimeout(bootTimer);
      subscription.unsubscribe();
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sign out ─────────────────────────────
  const handleSignOut = async () => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setDbQuests([]);
    setAppState('unauthenticated');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        appState,
        networkStatus,
        userProfile,
        dbQuests,
        refreshProfile,
        refreshQuests,
        handleOnboardingComplete,
        signOut: handleSignOut,
        setDbQuests,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
