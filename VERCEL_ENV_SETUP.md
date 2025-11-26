# Vercel Environment Variables Setup

## ✅ Build Fix Applied

The build will now succeed on Vercel **even without environment variables set**. However, the app will not function properly until you configure them.

## 🚀 Required Environment Variables

Go to your Vercel project settings: **Settings → Environment Variables**

Add the following variables for **Production**, **Preview**, and **Development**:

### 1. Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://khlrmbtalttxuuufucyf.supabase.co
```

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHJtYnRhbHR0eHV1dWZ1Y3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjk1NzksImV4cCI6MjA3OTYwNTU3OX0.gBBd_DSgOcwdwF9OkHbxJHYSzThGiM5XHnDCPELDlco
```

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHJtYnRhbHR0eHV1dWZ1Y3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAyOTU3OSwiZXhwIjoyMDc5NjA1NTc5fQ.iJe0Nso6Hk9u6js6B4CgX7P1rU-fAEM2pVA1uUPBdYg
```

### 2. NextAuth Configuration

Generate a secure secret:
```bash
openssl rand -base64 32
```

Then add:

```bash
NEXTAUTH_SECRET=<your-generated-secret-here>
```

```bash
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Important:** Update `NEXTAUTH_URL` to match your actual Vercel deployment URL.

### 3. Optional: GitHub OAuth (if using)

```bash
GITHUB_ID=your-github-oauth-client-id
```

```bash
GITHUB_SECRET=your-github-oauth-client-secret
```

## 📋 Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Select your FocusFlow project

2. **Open Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add Each Variable**
   - Click **Add New**
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Check all environments: **Production**, **Preview**, **Development**
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**
   - ✅ Check **"Clear Build Cache"**
   - Click **Redeploy**

## ⚠️ Important: Database Setup Required

Even with environment variables set, you **must create the database tables** in Supabase:

1. Go to: https://app.supabase.com/project/khlrmbtalttxuuufucyf/sql
2. Open `supabase_schema.sql` from this repository
3. Copy and paste the entire SQL into the SQL Editor
4. Click **Run** to create all tables
5. Verify tables appear in **Table Editor**

## ✅ Verification Checklist

After setting environment variables and deploying:

- [ ] Build completes successfully on Vercel
- [ ] App loads at your Vercel URL
- [ ] Can access signup page
- [ ] Can create an account (after running `supabase_schema.sql`)
- [ ] Can log in
- [ ] Dashboard loads with user data
- [ ] Can create tasks and check-ins

## 🔍 Troubleshooting

### Build Still Fails
- Make sure you pushed the latest code (`fix/ai-upgrade` branch)
- Clear build cache and redeploy
- Check build logs for specific errors

### App Loads But Features Don't Work
- Verify all environment variables are set correctly
- Check that `NEXTAUTH_URL` matches your actual domain
- Ensure you ran `supabase_schema.sql` in Supabase
- Check browser console for errors

### Database Operations Fail
- Run `supabase_schema.sql` in Supabase SQL Editor
- Verify tables exist in Supabase Table Editor
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Try using `SUPABASE_SERVICE_ROLE_KEY` for server operations

### Authentication Issues
- Regenerate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- Clear cookies and try again

## 📞 Quick Reference

**Your Supabase Project:** https://app.supabase.com/project/khlrmbtalttxuuufucyf
**Your Vercel Dashboard:** https://vercel.com/dashboard
**GitHub Repository:** https://github.com/BlueRang-it/focusflow

---

## 🎯 Expected Timeline

1. **Set environment variables** - 5 minutes
2. **Redeploy with cache cleared** - 2-3 minutes
3. **Run SQL schema in Supabase** - 2 minutes
4. **Test the app** - 5 minutes

**Total time to go live:** ~15 minutes

---

**Status:** Build fix deployed to `fix/ai-upgrade` branch
**Next Step:** Set environment variables in Vercel, then redeploy
