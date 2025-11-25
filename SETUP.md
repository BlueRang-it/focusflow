# FocusFlow - Complete Setup Guide

## 🚀 Project Overview

FocusFlow is a comprehensive productivity and personal-growth platform built with Next.js 15+, TypeScript, Prisma, and PostgreSQL. It combines task management, time tracking, journaling, analytics, habit reinforcement, and gamification in one unified application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running Locally](#running-locally)
6. [Project Structure](#project-structure)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

- **Node.js**: Version 18.17 or later
- **npm**: Version 9 or later (comes with Node.js)
- **PostgreSQL**: Version 13 or later (local or cloud)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Verify Installation

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

## 📦 Installation

### 1. Clone the Repository (if applicable)

```bash
git clone <repository-url>
cd focusflow
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 15+
- React 19+
- TypeScript
- Prisma
- NextAuth.js
- Tailwind CSS
- Date-fns
- Zod
- And more...

## 🗄️ Database Setup

### Option A: PostgreSQL Local Setup

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Note the password you set for the `postgres` user
4. Open pgAdmin or psql terminal

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Option B: Cloud Database (Recommended for Production)

Use one of these services:
- **Vercel Postgres**: https://vercel.com/storage/postgres
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com (MySQL compatible)
- **AWS RDS**: https://aws.amazon.com/rds/

### Create Database

**Using psql:**
```bash
psql -U postgres
```

```sql
CREATE DATABASE focusflow;
\q
```

**Using pgAdmin:**
1. Right-click "Databases"
2. Click "Create" > "Database"
3. Name: `focusflow`
4. Click "Save"

## 🔐 Environment Configuration

### 1. Create `.env.local` File

In the project root directory, create a file named `.env.local`:

```bash
touch .env.local
```

### 2. Add Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/focusflow"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional - for GitHub login)
GITHUB_ID=""
GITHUB_SECRET=""
```

### Generate Secret Key

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Get GitHub OAuth Credentials (Optional)

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: FocusFlow
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Copy Client ID and Client Secret to `.env.local`

## 🔄 Running Locally

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Run Database Migrations

```bash
# Create and run migrations
npx prisma migrate dev --name init
```

This will:
- Create tables in your database
- Generate Prisma client types
- Create a migration file

### 3. Optional: Seed Database

```bash
# If you create a prisma/seed.ts file
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

## 📁 Project Structure

```
focusflow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/     # NextAuth route handler
│   │   │   │   └── signup/            # Signup endpoint
│   │   │   ├── check-ins/             # Check-in endpoints
│   │   │   ├── journal/               # Journal endpoints
│   │   │   ├── tasks/                 # Task endpoints
│   │   │   ├── analytics/             # Analytics endpoints
│   │   │   └── session/               # Session endpoint
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── signup/page.tsx       # Signup page
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Progress.tsx
│   │   └── CheckInModal.tsx
│   ├── auth/                         # NextAuth configuration
│   │   ├── config.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client
│   │   └── productivity.ts          # Utility functions
│   └── generated/
│       └── prisma/                  # Auto-generated types
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Migration files
├── public/                          # Static assets
├── .env.local                       # Local environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 📡 API Documentation

### Authentication

**POST /api/auth/signup**
- Create new user account
- Body: `{ name, email, password }`

**GET /api/session**
- Get current session info
- Requires authentication

### Tasks

**GET /api/tasks**
- Fetch user's tasks
- Query params: `status`, `date`

**POST /api/tasks**
- Create new task
- Body: `{ title, priority, timeEstimate, dueDate }`

**PATCH /api/tasks/[id]**
- Update task
- Body: `{ status, timeSpent }`

**DELETE /api/tasks/[id]**
- Delete task

### Check-Ins

**GET /api/check-ins**
- Fetch check-ins
- Query params: `days`

**POST /api/check-ins**
- Submit check-in
- Body: `{ accomplishment, productivityRating, mood, blockers }`

### Journal

**GET /api/journal**
- Fetch journal entries
- Query params: `search`, `mood`, `limit`, `offset`

**POST /api/journal**
- Create journal entry
- Body: `{ title, content, mood, productivity, reflectionNotes }`

### Analytics

**GET /api/analytics**
- Get analytics data
- Query params: `period` (week, month, all)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Steps:**
1. Link GitHub repository
2. Set environment variables in Vercel Dashboard
3. Deploy automatically on git push

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway deploy
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create focusflow-app
git push heroku main
```

### Manual Deployment (VPS/Cloud Server)

```bash
# 1. Build application
npm run build

# 2. Start production server
npm start

# 3. Use process manager (PM2)
npm install -g pm2
pm2 start npm --name "focusflow" -- start
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking (with tsc)
npm run typecheck

# Prisma commands
npx prisma generate      # Generate client
npx prisma migrate dev   # Create migration
npx prisma studio       # Open Prisma Studio UI
npx prisma reset        # Reset database (development only)
```

## 📊 Database Management

### View Database (Prisma Studio)

```bash
npx prisma studio
```

Opens interactive UI at http://localhost:5555

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

### Export Data

```bash
# Backup PostgreSQL database
pg_dump -U postgres focusflow > backup.sql

# Restore from backup
psql -U postgres focusflow < backup.sql
```

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` (added to `.gitignore`)
- ✅ Use strong NEXTAUTH_SECRET (min 32 characters)
- ✅ Keep dependencies updated: `npm update`
- ✅ Use HTTPS in production
- ✅ Validate all user inputs (Zod)
- ✅ Use environment variables for secrets
- ✅ Enable two-factor authentication for your accounts

## 🐛 Troubleshooting

### Issue: "Cannot find module 'next'"

**Solution:**
```bash
npm install
npm run dev
```

### Issue: "Database connection failed"

**Check:**
1. PostgreSQL is running: `pg_isready`
2. DATABASE_URL is correct in `.env.local`
3. Database exists: `psql -l`
4. User permissions are correct

### Issue: "Prisma generate failed"

**Solution:**
```bash
npm install
npx prisma generate
```

### Issue: "NextAuth session not working"

**Check:**
1. NEXTAUTH_SECRET is set in `.env.local`
2. NEXTAUTH_URL matches your domain
3. SessionProvider wraps app in layout.tsx
4. Cookies are not blocked

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process using port 3000
# On macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
npm run dev -- -p 3001
```

### Issue: "Type 'unknown' is not assignable to type"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

## 📝 Notes

- First-time setup takes 5-10 minutes
- Database migrations run automatically
- Hot reload enabled in development
- TypeScript compilation on save

## ✨ Next Steps

1. ✅ Complete setup following this guide
2. ✅ Create your account and explore dashboard
3. ✅ Try creating tasks and check-ins
4. ✅ Review analytics and journal features
5. ✅ Customize with your own branding

---

**Happy building! 🚀**
