// Supabase client for database operations
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create a safe client that works at build time even without env vars
// Use placeholder values during build, real values at runtime
const buildTimeSafeUrl = supabaseUrl || "https://placeholder.supabase.co";
const buildTimeSafeKey = supabaseKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder";

export const supabase: SupabaseClient = createClient(buildTimeSafeUrl, buildTimeSafeKey);

// Warn at runtime if env vars are missing (not at build time)
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  Supabase env vars not set. Database operations will fail.");
  }
}
