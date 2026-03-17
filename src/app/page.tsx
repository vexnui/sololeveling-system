'use client';

import { useGameStore } from '@/store/gameStore';
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

export default function Home() {
  const { showSplash, showPenaltyScreen } = useGameStore();

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Mobile-width container */}
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
