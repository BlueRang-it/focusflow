# 🚀 FocusFlow Pro - Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- ✅ Supabase project set up
- ✅ Database schema deployed (via Prisma or Supabase SQL editor)
- ✅ All environment variables configured
- ✅ NextAuth configuration complete
- ✅ All dependencies installed

---

## Step 1: Database Setup

### Option A: Using Prisma (Recommended)

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### Option B: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the `supabase_schema.sql` file
4. Verify all tables are created

---

## Step 2: Environment Variables

Create `.env.local` file with these variables:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: For production
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Step 3: Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

---

## Step 4: Build & Test Locally

```bash
# Development mode
npm run dev

# Production build test
npm run build
npm run start
```

### Test All Features:

1. **Authentication**
   - Sign up: `/auth/signup`
   - Login: `/auth/login`
   - Logout

2. **Dashboard**
   - View all metrics
   - Check pace indicator
   - Test XP progress bar
   - Click notification bell

3. **Habits**
   - Create new habit
   - Log habit completion
   - View streak increase
   - Delete habit

4. **Weekly Review**
   - Create a review
   - View AI insights
   - Check metrics calculation

5. **Settings**
   - Toggle notification preferences
   - Change productivity style
   - Save settings

6. **APIs** - Test all endpoints:
   ```bash
   # Check-ins
   GET/POST /api/check-ins
   
   # Tasks
   GET/POST /api/tasks
   PATCH/DELETE /api/tasks/[id]
   
   # Habits
   GET/POST /api/habits
   PATCH/DELETE /api/habits/[id]
   POST /api/habits/[id]/log
   
   # Weekly Reviews
   GET/POST /api/weekly-reviews
   
   # Notifications
   GET/POST /api/notifications
   PATCH/DELETE /api/notifications/[id]
   
   # Preferences
   GET/PUT /api/preferences
   
   # Analytics
   GET /api/analytics
   
   # AI Coach
   GET/POST /api/ai-coach
   ```

---

## Step 5: Deploy to Vercel

### 5.1 Push to GitHub

```bash
git add .
git commit -m "feat: complete FocusFlow Pro MVP with all PRD features"
git push origin main
```

### 5.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 5.3 Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

Add all variables from `.env.local`:
- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_URL (use your production URL: `https://focusflow-pro.vercel.app`)
- NEXTAUTH_SECRET

### 5.4 Deploy

Click "Deploy" and wait for build to complete (~2-3 minutes)

---

## Step 6: Setup Background Jobs (Notifications)

Background jobs need to run on a schedule for:
- Hourly check-in reminders
- Daily motivation messages
- Inactivity detection
- Streak milestone checks
- Daily digest

### Option A: Vercel Cron Jobs (Recommended)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/hourly",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/inactivity",
      "schedule": "0 */3 * * *"
    }
  ]
}
```

Create cron endpoint files:

**`src/app/api/cron/hourly/route.ts`**:
```typescript
import { NextResponse } from "next/server";
import { sendHourlyCheckInReminders } from "@/lib/notification-scheduler";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sendHourlyCheckInReminders();
  return NextResponse.json({ success: true });
}
```

**`src/app/api/cron/daily/route.ts`**:
```typescript
import { NextResponse } from "next/server";
import { sendDailyMotivation, checkStreakMilestones, sendDailyDigest } from "@/lib/notification-scheduler";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sendDailyMotivation();
  await checkStreakMilestones();
  await sendDailyDigest();
  
  return NextResponse.json({ success: true });
}
```

**`src/app/api/cron/inactivity/route.ts`**:
```typescript
import { NextResponse } from "next/server";
import { detectInactivity } from "@/lib/notification-scheduler";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await detectInactivity();
  return NextResponse.json({ success: true });
}
```

Add `CRON_SECRET` to Vercel environment variables.

### Option B: External Cron Service

Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **Render Cron Jobs**

Schedule HTTP requests to your API endpoints:
- `https://your-app.vercel.app/api/cron/hourly` (every hour)
- `https://your-app.vercel.app/api/cron/daily` (8 AM daily)
- `https://your-app.vercel.app/api/cron/inactivity` (every 3 hours)

---

## Step 7: Post-Deployment Testing

### 7.1 Verify Deployment

✅ Visit your production URL
✅ Sign up a new user
✅ Test all features:
   - Create tasks
   - Log check-ins
   - Create habits
   - Log habit completion
   - Create weekly review
   - Change settings
   - View notifications

### 7.2 Monitor Performance

- Check Vercel Analytics
- Monitor Supabase Dashboard for database queries
- Review error logs in Vercel

### 7.3 Setup Monitoring (Optional)

Integrate with:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics

---

## Step 8: Domain Setup (Optional)

### 8.1 Add Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain (e.g., `focusflowpro.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to use your custom domain

---

## Common Issues & Solutions

### Issue 1: Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP allowlist includes `0.0.0.0/0` (or Vercel IPs)

### Issue 2: NextAuth Session Error

**Error**: `[next-auth][error][CLIENT_FETCH_ERROR]`

**Solution**:
- Verify `NEXTAUTH_URL` matches your deployment URL
- Regenerate `NEXTAUTH_SECRET`
- Clear browser cookies

### Issue 3: Build Errors

**Error**: `Module not found` or `Type errors`

**Solution**:
```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

### Issue 4: API Routes 404

**Error**: `404 on /api/habits`

**Solution**:
- Verify file structure matches App Router conventions
- Check file is named `route.ts` (not `index.ts`)
- Ensure proper export (`export async function GET/POST`)

---

## Performance Optimization

### Enable Vercel Features:

1. **Edge Functions** - For faster API responses
2. **Image Optimization** - Automatic image optimization
3. **Analytics** - Monitor Core Web Vitals
4. **Speed Insights** - Performance monitoring

### Database Optimization:

1. **Indexes** - Already included in schema:
   ```sql
   -- Check index usage in Supabase
   SELECT * FROM pg_stat_user_indexes;
   ```

2. **Connection Pooling** - Use Supabase connection pooler:
   ```env
   DATABASE_URL="postgresql://...pooler.supabase.com:6543/..."
   ```

---

## Security Checklist

✅ Environment variables are set correctly
✅ NEXTAUTH_SECRET is strong and unique
✅ Supabase RLS policies are enabled
✅ API routes validate authentication
✅ CORS is configured properly
✅ Rate limiting on sensitive endpoints (future)
✅ SQL injection prevention (via Prisma/Supabase)
✅ XSS protection (via Next.js defaults)

---

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups.

**Manual Backup**:
```bash
# Export database
npx prisma db pull
npx prisma db push --preview-feature
```

### Code Backups

- ✅ Git repository (primary backup)
- ✅ GitHub repository (remote backup)
- ✅ Local clones on team machines

---

## Scaling Considerations

### When to Upgrade:

**From Hobby to Pro Plan** (Vercel):
- \> 100GB bandwidth/month
- \> 100,000 serverless function invocations/day
- Need for team collaboration

**Database Scaling** (Supabase):
- \> 500MB database size
- \> 50 concurrent connections
- Need for point-in-time recovery

### Future Optimizations:

1. **Caching Layer** - Redis for frequently accessed data
2. **CDN** - Vercel Edge Network (automatic)
3. **Database Read Replicas** - For analytics queries
4. **Background Job Queue** - BullMQ or Inngest

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check notification delivery
- Review user feedback

### Weekly
- Database performance review
- Check streak calculations
- Review analytics data

### Monthly
- Security updates (`npm audit`)
- Dependency updates
- Feature usage analysis
- User satisfaction survey

---

## Support & Monitoring

### Monitoring Tools

1. **Vercel Dashboard** - Deployment status, analytics
2. **Supabase Dashboard** - Database queries, API usage
3. **Browser DevTools** - Client-side errors

### Health Check Endpoint

Create `/api/health/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "unhealthy",
      error: "Database connection failed"
    }, { status: 503 });
  }
}
```

---

## 🎉 Congratulations!

Your FocusFlow Pro application is now deployed and ready for users!

### Next Steps:

1. ✅ Share with beta testers
2. ✅ Collect user feedback
3. ✅ Monitor performance metrics
4. ✅ Iterate based on usage patterns

### Resources:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Deployed by**: FocusFlow Pro Team
**Last Updated**: December 2024
