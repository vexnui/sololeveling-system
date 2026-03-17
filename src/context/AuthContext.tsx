'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase_client';
import { getUserProfile, userProfileExists } from '@/lib/user_service';
import { getUserQuests, seedDefaultQuestsForUser } from '@/lib/quest_service';
import type { UserProfile } from '@/lib/user_service';
import type { DbQuest } from '@/lib/quest_service';

type AppState = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  appState: AppState;
  userProfile: UserProfile | null;
  dbQuests: DbQuest[];
  refreshProfile: () => Promise<void>;
  refreshQuests: () => Promise<void>;
  handleOnboardingComplete: (username: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appState, setAppState] = useState<AppState>('loading');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dbQuests, setDbQuests] = useState<DbQuest[]>([]);

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

  const initUserSession = useCallback(async (authUser: User) => {
    setUser(authUser);

    // Check if profile exists
    const exists = await userProfileExists(authUser.id);
    if (!exists) {
      setAppState('onboarding');
      return;
    }

    // Load profile and quests
    const [profile, quests] = await Promise.all([
      getUserProfile(authUser.id),
      getUserQuests(authUser.id),
    ]);

    setUserProfile(profile);

    // Seed quests if none exist
    if (quests.length === 0) {
      const seeded = await seedDefaultQuestsForUser(authUser.id);
      setDbQuests(seeded);
    } else {
      setDbQuests(quests);
    }

    setAppState('authenticated');
  }, []);

  const handleOnboardingComplete = useCallback(async (username: string) => {
    if (!user) return;
    const [profile, quests] = await Promise.all([
      getUserProfile(user.id),
      getUserQuests(user.id),
    ]);
    setUserProfile(profile);
    setDbQuests(quests);
    setAppState('authenticated');
    void username; // used in OnboardingScreen display
  }, [user]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession(data.session);
        initUserSession(data.session.user);
      } else {
        setAppState('unauthenticated');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        initUserSession(newSession.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setDbQuests([]);
        setAppState('unauthenticated');
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
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
        userProfile,
        dbQuests,
        refreshProfile,
        refreshQuests,
        handleOnboardingComplete,
        signOut: handleSignOut,
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
