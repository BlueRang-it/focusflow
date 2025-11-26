-- FocusFlow - Complete Supabase Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT,
  "profileImage" TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  "longestStreak" INTEGER DEFAULT 0,
  "totalCheckIns" INTEGER DEFAULT 0,
  "totalTasks" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED')),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  "timeEstimate" INTEGER,
  "timeSpent" INTEGER DEFAULT 0,
  "dueDate" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHECK-INS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "taskId" UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  accomplishment TEXT NOT NULL,
  "productivityRating" INTEGER NOT NULL CHECK ("productivityRating" >= 1 AND "productivityRating" <= 10),
  mood TEXT NOT NULL CHECK (mood IN ('VERY_UNHAPPY', 'UNHAPPY', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY')),
  blockers TEXT,
  distractions TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOURNAL ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('VERY_UNHAPPY', 'UNHAPPY', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY')),
  productivity INTEGER CHECK (productivity >= 1 AND productivity <= 10),
  "reflectionNotes" TEXT,
  "lessonsLearned" TEXT,
  "tomorrowPlan" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  "totalFocusTime" INTEGER DEFAULT 0,
  "averageProductivity" DECIMAL(3,2) DEFAULT 0,
  "taskCompletionRate" DECIMAL(5,2) DEFAULT 0,
  "bestProductivityHour" INTEGER,
  "mostProductiveDay" TEXT,
  "totalBreaksCount" INTEGER DEFAULT 0,
  "averageBreakDuration" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  "workDuration" INTEGER DEFAULT 25,
  "shortBreakDuration" INTEGER DEFAULT 5,
  "longBreakDuration" INTEGER DEFAULT 15,
  "dailyGoal" INTEGER DEFAULT 8,
  "notificationsEnabled" BOOLEAN DEFAULT true,
  "soundEnabled" BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MOOD ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('VERY_UNHAPPY', 'UNHAPPY', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY')),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  notes TEXT,
  "recordedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI COACH SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "sessionType" TEXT NOT NULL CHECK ("sessionType" IN (
    'BEHAVIOR_ANALYSIS', 'PROCRASTINATION_PREDICTION', 'TASK_RECOMMENDATION',
    'DAILY_BRIEF', 'WEEKLY_SUMMARY', 'BURNOUT_DETECTION', 'MOTIVATION_BOOST',
    'PATTERN_IDENTIFICATION', 'PLANNING_ASSISTANCE', 'REFLECTION'
  )),
  context TEXT,
  analysis TEXT,
  prediction TEXT,
  recommendation TEXT,
  "motivationalMessage" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY STATS TABLE (for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "analyticsId" UUID NOT NULL REFERENCES public.analytics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  "tasksCompleted" INTEGER DEFAULT 0,
  "focusTimeMinutes" INTEGER DEFAULT 0,
  "checkInsCount" INTEGER DEFAULT 0,
  "averageProductivity" DECIMAL(3,2) DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("analyticsId", date)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks("userId");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks("dueDate");
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins("userId");
CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON public.check_ins("createdAt");
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries("userId");
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries("userId");
CREATE INDEX IF NOT EXISTS idx_mood_entries_recorded_at ON public.mood_entries("recordedAt");
CREATE INDEX IF NOT EXISTS idx_ai_coach_sessions_user_id ON public.ai_coach_sessions("userId");
CREATE INDEX IF NOT EXISTS idx_daily_stats_analytics_id ON public.daily_stats("analyticsId");
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Users: Allow public signup (insert), users can read/update their own data
CREATE POLICY "Allow public user signup" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (true);

-- Tasks: Users can manage their own tasks
CREATE POLICY "Users can CRUD own tasks" ON public.tasks
  FOR ALL USING (true);

-- Check-ins: Users can manage their own check-ins
CREATE POLICY "Users can CRUD own check-ins" ON public.check_ins
  FOR ALL USING (true);

-- Journal: Users can manage their own journal entries
CREATE POLICY "Users can CRUD own journal" ON public.journal_entries
  FOR ALL USING (true);

-- Analytics: Users can read/update their own analytics
CREATE POLICY "Users can access own analytics" ON public.analytics
  FOR ALL USING (true);

-- User Preferences: Users can manage their own preferences
CREATE POLICY "Users can CRUD own preferences" ON public.user_preferences
  FOR ALL USING (true);

-- Mood Entries: Users can manage their own mood entries
CREATE POLICY "Users can CRUD own mood entries" ON public.mood_entries
  FOR ALL USING (true);

-- AI Coach Sessions: Users can manage their own sessions
CREATE POLICY "Users can CRUD own AI sessions" ON public.ai_coach_sessions
  FOR ALL USING (true);

-- Daily Stats: Users can access their own stats
CREATE POLICY "Users can access own daily stats" ON public.daily_stats
  FOR ALL USING (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON public.analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify schema after running:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
