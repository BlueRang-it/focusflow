# FocusFlow - Vercel Deployment Fix Guide

## Issues Found & Solutions

### ✅ FIXED: Dependency Conflicts
**Issue:** ai@2.2.37 required React ^18, but project uses React 19.2.0  
**Solution:** Upgraded to ai@^3.3.0 with overrides + added `.npmrc` with `legacy-peer-deps=true`  
**Status:** ✅ Build now succeeds locally

### ✅ FIXED: Next.js 16 Route Handler Types
**Issue:** Dynamic route params must be Promise in Next.js 16  
**Solution:** Updated `/api/tasks/[id]/route.ts` to use `Promise<{ id: string }>` and `await context.params`  
**Status:** ✅ TypeScript compiles without errors

### ❌ CRITICAL: Supabase Schema Cache Issue
**Issue:** PostgREST can't find tables - `PGRST205: Could not find the table 'public.users' in the schema cache`  
**Impact:** Signup, login, and all database operations fail with 500 errors  
**Root Cause:** Supabase PostgREST API doesn't have the tables registered in its schema cache

## How to Fix the Supabase Issue

### Option 1: Reload Supabase Schema (Recommended)
1. Go to your Supabase Dashboard: https://app.supabase.com/project/khlrmbtalttxuuufucyf
2. Navigate to **Settings** → **API**
3. Click **"Reload schema cache"** or restart the PostgREST service
4. Verify tables appear in the **Table Editor**

### Option 2: Enable Tables in API
1. Go to **Database** → **Tables**
2. For each table (users, tasks, check_ins, etc.), ensure:
   - ✅ Table is in the `public` schema
   - ✅ RLS (Row Level Security) policies are configured OR RLS is disabled for testing
3. Run this SQL in the SQL Editor:

```sql
-- Verify tables exist
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Check if PostgREST can see them
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Option 3: Create Missing Tables
If tables don't exist, you need to run migrations. Since Prisma was removed, use this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create other tables (tasks, check_ins, journal_entries, analytics, etc.)
-- See prisma/schema.prisma for full schema reference

-- Enable RLS (optional, for security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for signup)
CREATE POLICY "Allow public insert" ON public.users
  FOR INSERT WITH CHECK (true);

-- Create policy to allow user to read own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);
```

### Option 4: Use Supabase Auth Instead
Consider using Supabase's built-in Auth instead of manual user management:
- Handles user registration automatically
- Manages sessions and JWT tokens
- Includes RLS policies out of the box

## Vercel Environment Variables

Ensure these are set in Vercel project settings:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://khlrmbtalttxuuufucyf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.vercel.app

# Optional: Use if tables continue having issues
SUPABASE_URL=https://khlrmbtalttxuuufucyf.supabase.co
SUPABASE_ANON_KEY=<same-as-NEXT_PUBLIC>
```

## Quick Test After Fix

Run this to verify the fix worked:

```bash
node tmp_rovodev_check_rls.mjs
```

Expected output after fix:
```
✅ Service key works!
   Found X users
✅ Insert successful!
```

## Alternative: Switch to Service Role Key for Server Operations

If RLS is blocking operations, update `src/lib/prisma.ts`:

```typescript
// Use service role key for server-side operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.SUPABASE_ANON_KEY || "";
```

⚠️ **Security Note:** Only use service role key on the server side, never expose it to the client.

## Deployment Checklist

- [ ] Fix Supabase schema cache issue (reload or create tables)
- [ ] Set all Vercel environment variables
- [ ] Clear Vercel build cache before redeploying
- [ ] Test signup/login after deployment
- [ ] Verify all API endpoints return proper responses (not 500)

## Code Changes Made (Already Applied)

✅ Upgraded ai to ^3.3.0  
✅ Added .npmrc with legacy-peer-deps=true  
✅ Fixed Next.js 16 route handler types in /api/tasks/[id]  
✅ Enhanced Prisma shim to handle camelCase model names  

## Next Steps

1. **Immediate:** Fix the Supabase schema cache (see Option 1 above)
2. **Then:** Redeploy to Vercel with cleared cache
3. **Test:** Verify signup, login, and all features work
4. **Optional:** Consider migrating to Supabase Auth for better security

---

**Questions or need help?** Share the Supabase dashboard access or the SQL migration files.
