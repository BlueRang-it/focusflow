// Supabase-backed lightweight shim that provides a minimal Prisma-like API
// for the parts of the codebase that still call `prisma.*`.
// This avoids depending on `@prisma/client` at build time and routes DB
// operations to Supabase. It's intentionally permissive and returns `any`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  // At build time we don't want to crash — runtime calls will fail with clearer errors.
  // Keep a no-op client to avoid runtime exceptions when imported.
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Map model names to Supabase table names
const tableMap: Record<string, string> = {
  User: "users",
  Task: "tasks",
  CheckIn: "check_ins",
  JournalEntry: "journal_entries",
  Analytics: "analytics",
  UserPreferences: "user_preferences",
  Habit: "habits",
  HabitLog: "habit_logs",
  Goal: "goals",
  Project: "projects",
  DeepWorkBlock: "deep_work_blocks",
  TimeTrackingEntry: "time_tracking_entries",
  MoodEntry: "mood_entries",
  WeeklyReview: "weekly_reviews",
  FocusPersonality: "focus_personality",
  AICoachSession: "ai_coach_sessions",
  ScheduledTask: "scheduled_tasks",
  CalendarEvent: "calendar_events",
  Badge: "badges",
  Achievement: "achievements",
  Milestone: "milestones",
};

function getTable(modelName: string) {
  return tableMap[modelName] || modelName.toLowerCase() + "s";
}

function applyWhere(query: any, where: Record<string, any>) {
  if (!where) return query;
  for (const key of Object.keys(where)) {
    const val = where[key];
    if (val && typeof val === "object") {
      if (val.gte !== undefined) query = query.gte(key, val.gte);
      if (val.lte !== undefined) query = query.lte(key, val.lte);
      if (val.gt !== undefined) query = query.gt(key, val.gt);
      if (val.lt !== undefined) query = query.lt(key, val.lt);
      if (val.in !== undefined && Array.isArray(val.in)) query = query.in(key, val.in);
      if (val.not !== undefined) query = query.neq(key, val.not);
    } else {
      query = query.eq(key, val as any);
    }
  }
  return query;
}

function applyOrderBy(query: any, orderBy: any) {
  if (!orderBy) return query;
  // orderBy can be array or object
  const entries = Array.isArray(orderBy) ? orderBy : [orderBy];
  for (const entry of entries) {
    const [field, dir] = Object.entries(entry)[0];
    query = query.order(field, { ascending: dir === "asc" });
  }
  return query;
}

function makeModelProxy(modelName: string) {
  const table = getTable(modelName);

  return {
    findUnique: async ({ where }: { where: Record<string, any> }) => {
      let q: any = supabase.from(table).select("*");
      q = applyWhere(q, where);
      const res = await q.single();
      if (res.error) return null;
      return res.data as any;
    },
    findFirst: async ({ where, orderBy }: { where?: Record<string, any>; orderBy?: any }) => {
      let q: any = supabase.from(table).select("*");
      q = applyWhere(q, where || {});
      q = applyOrderBy(q, orderBy);
      const res = await q.limit(1);
      if (res.error) return null;
      return res.data?.[0] ?? null;
    },
    findMany: async ({ where, orderBy, take }: { where?: Record<string, any>; orderBy?: any; take?: number }) => {
      let q: any = supabase.from(table).select("*");
      q = applyWhere(q, where || {});
      q = applyOrderBy(q, orderBy);
      if (take) q = q.limit(take);
      const res = await q;
      if (res.error) return [];
      return res.data as any[];
    },
    create: async ({ data }: { data: Record<string, any> }) => {
      const res = await supabase.from(table).insert(data).select().single();
      if (res.error) throw res.error;
      return res.data as any;
    },
    update: async ({ where, data }: { where: Record<string, any>; data: Record<string, any> }) => {
      let q: any = supabase.from(table).update(data).select();
      q = applyWhere(q, where || {});
      const res = await q.limit(1);
      if (res.error) throw res.error;
      return res.data?.[0] ?? null;
    },
    delete: async ({ where }: { where: Record<string, any> }) => {
      let q: any = supabase.from(table).delete();
      q = applyWhere(q, where || {});
      const res = await q.limit(1);
      if (res.error) throw res.error;
      return res.data?.[0] ?? null;
    },
  } as any;
}

// Minimal proxy to create model accessors on demand
export const prisma = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return makeModelProxy(prop);
    },
  }
) as any;

/* eslint-enable @typescript-eslint/no-explicit-any */

