/**
 * Runtime environment variable validation
 * Provides clear error messages when required env vars are missing
 */

export function checkSupabaseEnv(): { ok: boolean; error?: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return {
      ok: false,
      error: "Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.",
    };
  }

  if (!supabaseKey || supabaseKey.includes("placeholder")) {
    return {
      ok: false,
      error: "Supabase API key not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.",
    };
  }

  return { ok: true };
}

export function checkNextAuthEnv(): { ok: boolean; error?: string } {
  const secret = process.env.NEXTAUTH_SECRET;
  const url = process.env.NEXTAUTH_URL;

  if (!secret) {
    return {
      ok: false,
      error: "NextAuth secret not configured. Please set NEXTAUTH_SECRET in your environment variables.",
    };
  }

  if (!url) {
    return {
      ok: false,
      error: "NextAuth URL not configured. Please set NEXTAUTH_URL in your environment variables.",
    };
  }

  return { ok: true };
}
