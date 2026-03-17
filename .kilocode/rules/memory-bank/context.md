# Active Context: System X — Gamified Life RPG

## Current State

**App Status**: ✅ Fully built with Supabase backend integration

System X is a complete gamified fitness + life RPG web app built with Next.js 16, TypeScript, Tailwind CSS 4, Zustand state management, and **Supabase** for authentication, database, and persistence. It features a dark anime-style interface inspired by Solo Leveling.

## Recently Completed

- [x] Full System X gamified RPG app built from scratch
- [x] Dark theme (#0D0D0D) with neon blue/purple HUD aesthetic
- [x] Zustand store with full game state and persistence
- [x] 10 screens implemented: Splash, Home, Quests, Stats, Boss, Social, Aura, Chat, Shop, Penalty
- [x] All CSS animations: glitch, aura pulse/rotate, scanlines, shimmer, level-up pop, warning flash
- [x] XP & leveling system with rank progression
- [x] Quest completion with XP gains and automatic level-up detection
- [x] Weekly Boss Fight with live countdown timer
- [x] Global leaderboard, friend system, PvP challenges
- [x] Aura visualization with animated rings and evolution tiers
- [x] AI Coach chat interface with system responses
- [x] Shop with equipment, skins, XP boosters
- [x] Penalty screen with full-screen warning overlay
- [x] Subscription plans: Free / Basic (₹50) / Pro (₹150)
- [x] Mobile-first responsive design (max-width: 430px)
- [x] **Supabase backend integration** (Project: SystemX, ID: jodoitmximgdjlqaxydr)
- [x] **Authentication system** — email/password signup + signin via Supabase Auth
- [x] **First-time onboarding** — "AWAKEN PLAYER" screen with username input + DB registration
- [x] **AuthProvider context** — global auth state, auto session restore, onboarding detection
- [x] **users table** sync — profile fetched from Supabase on login, synced to Zustand store
- [x] **quests table** sync — quests seeded per user, completed/failed synced to Supabase
- [x] **Penalty system** — failed quest → auto inserts penalty quest in Supabase
- [x] **Logout functionality** — button in HomeScreen header + bottom link
- [x] **Auth loading state** — SystemLoadingScreen shown while auth state resolves
- [x] Build passing, lint clean, typecheck passing

## Current Structure

| File/Directory | Purpose | Status |
|---|---|---|
| `src/app/page.tsx` | Main app shell with auth/onboarding/screen routing | ✅ |
| `src/app/layout.tsx` | Root layout with AuthProvider wrapper | ✅ |
| `src/app/globals.css` | Full RPG theme CSS with all animations | ✅ |
| `src/types/index.ts` | TypeScript types (Player, Quest, etc.) | ✅ |
| `src/types/database.ts` | Supabase DB schema types | ✅ |
| `src/lib/gameData.ts` | Static game data, constants, utilities | ✅ |
| `src/lib/supabase_client.ts` | Supabase client singleton | ✅ |
| `src/lib/auth_service.ts` | Auth helper functions (signUp, signIn, signOut) | ✅ |
| `src/lib/user_service.ts` | User profile CRUD + XP/leveling sync | ✅ |
| `src/lib/quest_service.ts` | Quest CRUD, seed, penalty insertion | ✅ |
| `src/context/AuthContext.tsx` | Auth state provider (user, profile, quests, appState) | ✅ |
| `src/store/gameStore.ts` | Zustand store with Supabase write-through | ✅ |
| `src/components/screens/AuthScreen.tsx` | Email+password login/signup HUD screen | ✅ |
| `src/components/screens/OnboardingScreen.tsx` | First-time player registration screen | ✅ |
| `src/components/screens/HomeScreen.tsx` | Home with real user data + logout | ✅ |
| `src/components/ui/` | HudCard, XpBar, StatBar, RankBadge, BottomNav, Notification, LevelUpPopup | ✅ |
| `src/components/screens/` | All 10 game screens | ✅ |

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + custom CSS animations
- **State**: Zustand with localStorage persistence
- **Backend**: Supabase (Auth + PostgreSQL)
- **Package manager**: Bun

## Supabase Setup Required

Run these SQL commands in Supabase dashboard (SQL editor) to create the tables:

```sql
-- Users table (linked to auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT 'E',
  aura TEXT NOT NULL DEFAULT 'white',
  stats_strength INT NOT NULL DEFAULT 10,
  stats_endurance INT NOT NULL DEFAULT 10,
  stats_discipline INT NOT NULL DEFAULT 10,
  stats_agility INT NOT NULL DEFAULT 10,
  stats_intelligence INT NOT NULL DEFAULT 10,
  missed_days INT NOT NULL DEFAULT 0,
  total_quests_completed INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  unlocked_abilities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  xp_reward INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  difficulty INT NOT NULL DEFAULT 1,
  icon TEXT NOT NULL DEFAULT '⚡',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quests" ON quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON quests FOR UPDATE USING (auth.uid() = user_id);
```

## Session History

| Date | Changes |
|---|---|
| Initial | Template created with base setup |
| 2026-03-17 | Full System X RPG app built — 10 screens, all game systems, dark HUD theme |
| 2026-03-17 | Supabase integration added — auth, users table, quests table, onboarding, logout |
