// Supabase client for database operations
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Validate environment variables at runtime
if (typeof window === "undefined") {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ CRITICAL: Supabase environment variables are not set!");
    console.error("❌ Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.error("❌ Current NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl || "NOT SET");
    console.error("❌ Current NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "SET (hidden)" : "NOT SET");
    
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ Make sure your .env.local file exists and contains:");
      console.error("   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
      console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
    }
  } else {
    console.log("✅ Supabase environment variables loaded successfully");
    console.log("✅ URL:", supabaseUrl);
  }
}

// Allow build to succeed without env vars, but warn
if (!supabaseUrl || !supabaseKey) {
  // Use placeholder during build - environment validation happens at runtime in API routes
  console.warn("⚠️  Using placeholder Supabase credentials (build time only)");
  console.warn("⚠️  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel to make the app functional");
}

const finalUrl = supabaseUrl || "https://placeholder.supabase.co";
const finalKey = supabaseKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder";

export const supabase: SupabaseClient = createClient(finalUrl, finalKey);
