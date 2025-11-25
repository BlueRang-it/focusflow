# FocusFlow + Supabase + GitHub + Vercel Setup Guide

## 🚀 Complete Setup Instructions

This guide walks you through setting up FocusFlow with Supabase, GitHub, and Vercel deployment.

---

## Part 1: Supabase Setup (Database)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign Up" and create an account
3. Create a new project:
   - Organization: Create new or select existing
   - Project name: `focusflow`
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to you (e.g., `us-east-1` for US)
4. Wait for project to initialize (~2 minutes)

### Step 2: Get Supabase Connection Strings

1. Go to **Project Settings** → **Database**
2. Copy the following:
   - **Connection string (URI)**: `postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres`
   - Replace `[PASSWORD]` with your database password
   - Replace `[PROJECT-ID]` with your project ID (visible in URL)

3. Also get:
   - **Project URL**: From **Settings** → **API** → `https://[PROJECT-ID].supabase.co`
   - **API Key (anon)**: From **Settings** → **API** → `anon` key
   - **API Key (service_role)**: From **Settings** → **API** → `service_role` key

### Step 3: Create .env.local File

Create `.env.local` in your project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_COACH=false
NEXT_PUBLIC_ENABLE_CALENDAR_SYNC=false
NEXT_PUBLIC_ENABLE_TIME_TRACKING=false
```

### Step 4: Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

---

## Part 2: Local Development Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables in your Supabase database
- Generate migration files
- Set up indexes and constraints

### Step 4: Verify Database Connection

```bash
npx prisma studio
```

Prisma Studio should open at `http://localhost:5555` showing your database tables.

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the FocusFlow landing page.

### Step 6: Test Locally

1. Click "Get Started"
2. Sign up with an email and password
3. You should be redirected to the dashboard
4. Test creating a task and submitting a check-in

---

## Part 3: GitHub Setup

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: FocusFlow with advanced features"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `focusflow` (or your preferred name)
3. Description: "AI-powered productivity and personal growth platform"
4. Choose **Private** (recommended for your own project)
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/focusflow.git
git branch -M main
git push -u origin main
```

### Step 4: Protect Sensitive Files

Verify `.gitignore` includes:
```
.env
.env.local
.env.*.local
node_modules/
```

Your `.env.local` should NOT be committed.

---

## Part 4: Vercel Deployment

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub to simplify)
3. Click "New Project"
4. Select "Import Git Repository"
5. Authorize GitHub and select your `focusflow` repository
6. Click "Import"

### Step 2: Configure Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

**Critical (must add):**
```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
DIRECT_URL = postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL = https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

**Optional (feature flags):**
```
NEXT_PUBLIC_ENABLE_DARK_MODE = true
NEXT_PUBLIC_ENABLE_ANALYTICS = true
NEXT_PUBLIC_ENABLE_AI_COACH = false
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. Once deployed, you get a live URL: `https://focusflow-xxx.vercel.app`

### Step 4: Update Supabase CORS (Important!)

1. Go to Supabase project settings
2. **API** → **CORS Configuration**
3. Add your Vercel URL:
   ```
   https://your-project.vercel.app
   ```

---

## Part 5: Connect Supabase with Vercel (Automatic Sync)

### Option A: Using Vercel Integration (Easiest)

1. In Vercel: **Settings** → **Integrations**
2. Search for "Supabase"
3. Click "Add Integration"
4. Authorize and select your Supabase project
5. This automatically syncs environment variables!

### Option B: Manual Sync

Keep these in sync between Supabase and Vercel:
- `DATABASE_URL` (connection string)
- `NEXTAUTH_URL` (update for production)
- API keys

---

## Part 6: Post-Deployment Checks

### Verify Everything Works:

1. **Database**: Test API endpoint
   ```bash
   curl https://your-project.vercel.app/api/session
   ```

2. **Authentication**: 
   - Visit landing page
   - Sign up with test account
   - Verify redirect to dashboard

3. **Check-Ins**: 
   - Create a task
   - Submit a check-in
   - Verify in Supabase

4. **Analytics**: 
   - View dashboard metrics
   - Verify calculations

---

## Part 7: Continuous Development

### Git Workflow:

```bash
# Make changes locally
git add .
git commit -m "Feature: Add new feature"

# Push to GitHub
git push origin main

# Vercel auto-deploys on push to main!
```

### Database Changes:

```bash
# Add new migration locally
npx prisma migrate dev --name add_new_feature

# Push migration to GitHub
git push origin main

# Vercel automatically runs migrations on deploy!
```

### View Logs:

- **Vercel**: https://vercel.com/dashboard → Your Project → **Deployments**
- **Supabase**: Your project → **Logs** → View queries and errors
- **Local**: `npm run dev` shows real-time logs

---

## Part 8: Feature Flags for Advanced Features

In your `.env.local` / Vercel:

```bash
# AI Productivity Coach
NEXT_PUBLIC_ENABLE_AI_COACH=false
OPENAI_API_KEY="" # Add when ready

# Calendar Integration
NEXT_PUBLIC_ENABLE_CALENDAR_SYNC=false
GOOGLE_CALENDAR_API_KEY="" # Add when ready
MICROSOFT_OUTLOOK_CLIENT_ID="" # Add when ready

# Time Tracking
NEXT_PUBLIC_ENABLE_TIME_TRACKING=false

# Deep Work Blocks
NEXT_PUBLIC_ENABLE_DEEP_WORK=true

# Weekly Reviews
NEXT_PUBLIC_ENABLE_WEEKLY_REVIEWS=true
```

---

## Troubleshooting

### "Cannot connect to Supabase"
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin < /dev/null
```

### "Prisma migrations failed"
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or see detailed error
npx prisma migrate status
```

### "Vercel deployment failed"
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Check that `.env` is in `.gitignore`

### "NEXTAUTH not working in production"
1. Verify `NEXTAUTH_URL` matches your Vercel domain
2. Check `NEXTAUTH_SECRET` is set
3. Restart deployment

---

## Next Steps

1. ✅ Database set up with Supabase
2. ✅ GitHub repository created
3. ✅ Deployed to Vercel
4. 🔄 Implement advanced features:
   - AI Coach integration
   - Calendar sync
   - Time tracking
   - Deep work blocks
   - Habit system
   - Goal hierarchy
   - Weekly reviews

---

## Quick Command Reference

```bash
# Local Development
npm install              # Install dependencies
npm run dev             # Start dev server
npx prisma studio      # Open database GUI

# Database
npx prisma migrate dev --name feature_name  # Create migration
npx prisma generate                         # Regenerate client
npx prisma migrate reset                    # Reset (⚠️ deletes data)

# Git & GitHub
git add .
git commit -m "message"
git push origin main

# Testing
curl http://localhost:3000/api/session  # Test API
```

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs

---

## Security Checklist

- ✅ `.env.local` added to `.gitignore`
- ✅ `NEXTAUTH_SECRET` is random (not committed)
- ✅ Database password is strong (20+ chars)
- ✅ API keys are kept private
- ✅ CORS configured for production domain
- ✅ Vercel environment variables use Production/Preview distinction

---

Happy coding! 🚀
