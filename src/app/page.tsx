'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/context/AuthContext';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { QuestScreen } from '@/components/screens/QuestScreen';
import { StatsScreen } from '@/components/screens/StatsScreen';
import { BossScreen } from '@/components/screens/BossScreen';
import { SocialScreen } from '@/components/screens/SocialScreen';
import { AuraScreen } from '@/components/screens/AuraScreen';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { ShopScreen } from '@/components/screens/ShopScreen';
import { PenaltyScreen } from '@/components/screens/PenaltyScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { BottomNav } from '@/components/ui/BottomNav';
import { NotificationToast } from '@/components/ui/Notification';
import { LevelUpPopup } from '@/components/ui/LevelUpPopup';

function MainContent() {
  const { currentScreen } = useGameStore();

  switch (currentScreen) {
    case 'home': return <HomeScreen />;
    case 'quests': return <QuestScreen />;
    case 'stats': return <StatsScreen />;
    case 'boss': return <BossScreen />;
    case 'social': return <SocialScreen />;
    case 'aura': return <AuraScreen />;
    case 'chat': return <ChatScreen />;
    case 'shop': return <ShopScreen />;
    default: return <HomeScreen />;
  }
}

function SystemLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-[#0D0D0D] grid-bg">
      <div
        className="w-20 h-20 flex items-center justify-center mb-6"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'linear-gradient(135deg, #001133, #000820)',
          boxShadow: '0 0 40px #00d4ff40',
        }}
      >
        <span className="text-2xl font-black font-mono" style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff' }}>
          SX
        </span>
      </div>
      <p className="text-[10px] tracking-[4px] font-mono text-[#00d4ff55] cursor uppercase">
        SYSTEM INITIALIZING
      </p>
    </div>
  );
}

export default function Home() {
  const { showSplash, showPenaltyScreen, loadPlayerFromProfile, loadQuestsFromDb, setUserId } = useGameStore();
  const { appState, user, userProfile, dbQuests, handleOnboardingComplete } = useAuth();

  // Sync auth user id into game store
  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user, setUserId]);

  // Load player profile into store when authenticated
  useEffect(() => {
    if (userProfile) {
      loadPlayerFromProfile(userProfile);
    }
  }, [userProfile, loadPlayerFromProfile]);

  // Load quests into store when available
  useEffect(() => {
    if (dbQuests.length > 0) {
      loadQuestsFromDb(dbQuests);
    }
  }, [dbQuests, loadQuestsFromDb]);

  // Show loading while checking auth
  if (appState === 'loading') {
    return <SystemLoadingScreen />;
  }

  // Show auth screen if not logged in
  if (appState === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-[#0D0D0D]">
        <div className="app-container relative">
          <AuthScreen onAuthSuccess={() => {}} />
        </div>
      </main>
    );
  }

  // Show onboarding for first-time users
  if (appState === 'onboarding' && user) {
    return (
      <main className="min-h-screen bg-[#0D0D0D]">
        <div className="app-container relative">
          <OnboardingScreen
            userId={user.id}
            userEmail={user.email ?? ''}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </main>
    );
  }

  // Main authenticated app
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      <div className="app-container relative">
        {/* Splash screen overlay */}
        {showSplash && <SplashScreen />}

        {/* Penalty screen overlay */}
        {showPenaltyScreen && <PenaltyScreen />}

        {/* Main app content */}
        {!showSplash && (
          <>
            <div className="overflow-y-auto">
              <MainContent />
            </div>
            <BottomNav />
          </>
        )}

        {/* Global overlays */}
        <NotificationToast />
        <LevelUpPopup />
      </div>
    </main>
  );
}
