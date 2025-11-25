# 🚀 FocusFlow Quick Start Guide

Get FocusFlow running locally in 5 minutes with Supabase.

---

## Step 1: Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works!)

---

## Step 2: Supabase Setup (2 minutes)

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com) 
2. Sign up/login
3. Click "New Project"
4. Enter project details:
   - **Name**: focusflow
   - **Password**: Save this!
   - **Region**: Choose your region
5. Wait for initialization

### 2.2 Get Connection String

1. Go to **Settings** → **Database**
2. Copy Connection String (URI):
   ```
   postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
   ```
3. Replace `[PASSWORD]` with your database password
4. Replace `[PROJECT-ID]` with your project ID (from URL)

### 2.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` (copy the full URL)
   - `anon` public key
   - `service_role` secret key

---

## Step 3: Local Setup (3 minutes)

### 3.1 Clone/Navigate to Project

```bash
cd /path/to/focusflow
```

### 3.2 Create .env.local

Create `.env.local` in the project root:

```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_COACH=false
```

### 3.3 Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

### 3.4 Install Dependencies

```bash
npm install
```

### 3.5 Setup Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates all database tables. Press Enter when prompted to create the migration.

### 3.6 Verify Database (Optional)

```bash
npx prisma studio
```

Opens at http://localhost:5555 - you should see all database tables.

---

## Step 4: Run Locally (Less than 1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

### Test Locally:

1. Click "Get Started"
2. Sign up with email: `test@focusflow.dev` / password: `Test123!`
3. You should see the dashboard!
4. Try creating a task and submitting a check-in

---

## Step 5: Troubleshooting

### "Cannot connect to database"

1. Check `.env.local` has correct DATABASE_URL
2. Verify Supabase project is running
3. Try: `npx prisma db execute --stdin < /dev/null`

### "Prisma client not generated"

```bash
npx prisma generate
```

### "Migrations failed"

```bash
# See what went wrong
npx prisma migrate status

# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset
```

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

---

## Step 6: GitHub Setup (Optional)

### 6.1 Initialize Git

```bash
git init
git add .
git commit -m "Initial FocusFlow setup with Supabase"
```

### 6.2 Create GitHub Repo

1. Go to [github.com/new](https://github.com/new)
2. Name: `focusflow`
3. Private recommended
4. Create

### 6.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/focusflow.git
git branch -M main
git push -u origin main
```

---

## Step 7: Vercel Deployment (Optional)

### 7.1 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. "Import Git Repository"
4. Select your focusflow repo

### 7.2 Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 7.3 Deploy

Click "Deploy" - done!

---

## What's Included

✅ **Database**: 15+ Prisma models
✅ **Authentication**: NextAuth.js with password hashing
✅ **API**: 12 endpoints for tasks, check-ins, journal, analytics
✅ **UI**: 5 reusable React components
✅ **Dashboard**: Real-time metrics and motivation
✅ **Advanced Features**: AI Coach, Habits, Goals, Deep Work, Mood tracking

---

## Next Steps

1. **Explore Dashboard**: Check out features at `/dashboard`
2. **Create Tasks**: Add tasks to test the system
3. **Submit Check-Ins**: Test the hourly check-in workflow
4. **View Analytics**: See productivity insights
5. **Read Docs**: Check SUPABASE_GITHUB_VERCEL_SETUP.md for detailed setup

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Database management
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create migrations
npx prisma db push         # Sync schema
npx prisma migrate reset   # Reset (⚠️ deletes data)

# Build for production
npm run build
npm start

# Format code
npm run format

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Support

- 📖 **Docs**: Read SUPABASE_GITHUB_VERCEL_SETUP.md
- 🐛 **Issues**: Check prisma studio / Supabase logs
- 💬 **Docs**: Next.js, Prisma, Supabase docs

---

**You're all set! 🎉 Start building!**
