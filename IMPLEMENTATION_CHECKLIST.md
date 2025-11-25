# 🎯 FocusFlow Implementation Checklist

Complete checklist for local setup, testing, GitHub, and Vercel deployment.

---

## Phase 1: Local Development Setup ✨

### Database (Supabase)
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new PostgreSQL project
- [ ] Get database password and project ID
- [ ] Get Connection String (DATABASE_URL)
- [ ] Get API keys (URL, anon, service_role)

### Environment Configuration
- [ ] Create `.env.local` file
- [ ] Add DATABASE_URL (Supabase connection string)
- [ ] Add DIRECT_URL (same as DATABASE_URL)
- [ ] Add SUPABASE_URL (project URL)
- [ ] Add SUPABASE_ANON_KEY
- [ ] Add SUPABASE_SERVICE_ROLE_KEY
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Add NEXTAUTH_URL=http://localhost:3000
- [ ] Copy all feature flags from .env.example

### Dependencies
- [ ] Run `npm install`
- [ ] Verify all packages installed (look for errors)

### Database Setup
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify all tables created (check Supabase dashboard or Prisma Studio)
- [ ] Open Prisma Studio: `npx prisma studio` (optional verification)

### Local Testing
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] See landing page loaded
- [ ] Click "Get Started" → Signup page appears
- [ ] Sign up with test account
- [ ] Dashboard page loads
- [ ] Create a test task
- [ ] Submit a check-in
- [ ] See XP awarded (+10)
- [ ] Check analytics update

### Pre-GitHub Checks
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Lint passing: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] `.env.local` is in `.gitignore` ✅
- [ ] `node_modules/` is in `.gitignore` ✅
- [ ] All test data working

---

## Phase 2: GitHub Setup 🐙

### Initialize Repository
- [ ] Open terminal in project root
- [ ] Run `git init`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial FocusFlow setup with Supabase and advanced features"`

### Create GitHub Repository
- [ ] Go to [github.com/new](https://github.com/new)
- [ ] Repository name: `focusflow`
- [ ] Description: "AI-powered productivity and personal growth platform"
- [ ] Select "Private" (recommended)
- [ ] Do NOT initialize with README (we have one)
- [ ] Click "Create repository"

### Connect Local to GitHub
- [ ] Copy remote URL from GitHub
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/focusflow.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify code appears on GitHub

### Verify GitHub Setup
- [ ] Browse to your repo on GitHub
- [ ] See all files uploaded
- [ ] `.env.local` NOT visible (good!)
- [ ] README.md displays properly
- [ ] QUICK_START.md visible
- [ ] ADVANCED_FEATURES.md visible

---

## Phase 3: Vercel Deployment 🚀

### Vercel Setup
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up/login (GitHub recommended)
- [ ] Click "New Project"
- [ ] Click "Import Git Repository"
- [ ] Authorize GitHub if needed
- [ ] Select your `focusflow` repository
- [ ] Click "Import"

### Configure Environment Variables
In Vercel project settings → Environment Variables:

**Critical Variables:**
- [ ] DATABASE_URL=`postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres`
- [ ] DIRECT_URL=`postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres`
- [ ] NEXTAUTH_SECRET=`your-generated-secret`
- [ ] NEXTAUTH_URL=`https://your-project.vercel.app` (will generate URL)
- [ ] NEXT_PUBLIC_SUPABASE_URL=`https://[PROJECT-ID].supabase.co`
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY=`your-anon-key`
- [ ] SUPABASE_SERVICE_ROLE_KEY=`your-service-role-key`

**Feature Flags:**
- [ ] NEXT_PUBLIC_ENABLE_DARK_MODE=true
- [ ] NEXT_PUBLIC_ENABLE_ANALYTICS=true
- [ ] NEXT_PUBLIC_ENABLE_AI_COACH=false
- [ ] NEXT_PUBLIC_ENABLE_CALENDAR_SYNC=false
- [ ] NEXT_PUBLIC_ENABLE_TIME_TRACKING=false

### Deploy
- [ ] Review build settings (should be auto-detected)
- [ ] Click "Deploy"
- [ ] Wait for build to complete (3-5 minutes)
- [ ] See "Deployment Successful" message
- [ ] Copy Vercel URL (e.g., focusflow-xxx.vercel.app)

### Post-Deployment
- [ ] Update NEXTAUTH_URL in Vercel with actual URL
- [ ] Redeploy if NEXTAUTH_URL changed
- [ ] Visit your Vercel URL
- [ ] See landing page loaded
- [ ] Test signup/login flow
- [ ] Test check-in submission
- [ ] Verify data persists

### Supabase CORS Configuration
- [ ] Go to Supabase project settings
- [ ] **API** → **CORS Configuration**
- [ ] Add your Vercel URL: `https://your-project.vercel.app`
- [ ] Save

### Production Testing
- [ ] Visit production URL
- [ ] Sign up new account
- [ ] Create task
- [ ] Submit check-in
- [ ] View analytics
- [ ] Verify all features work
- [ ] Check Supabase for data

---

## Phase 4: Continuous Development 🔄

### Making Changes
- [ ] Make code changes locally
- [ ] Test with `npm run dev`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint`
- [ ] Run `npm run format`

### Committing to GitHub
- [ ] Run `git add .`
- [ ] Run `git commit -m "Feature: descriptive message"`
- [ ] Run `git push origin main`
- [ ] Vercel auto-deploys on push to main ✅

### Database Migrations
- [ ] Make schema changes in `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name migration_name`
- [ ] Commit migration files: `git add prisma/migrations && git commit -m "feat: add migration"`
- [ ] Push to GitHub: `git push origin main`
- [ ] Vercel auto-runs migrations on deploy ✅

### Monitoring
- [ ] Check Vercel dashboard for deployments
- [ ] Check Supabase logs for queries
- [ ] View Prisma Studio for data: `npx prisma studio`

---

## Phase 5: Advanced Features (Future) 🎯

### Phase 5a: AI Coach Integration
- [ ] Sign up for OpenAI API
- [ ] Get API key
- [ ] Add OPENAI_API_KEY to .env.local AND Vercel
- [ ] Update AI Coach route to use OpenAI
- [ ] Set NEXT_PUBLIC_ENABLE_AI_COACH=true
- [ ] Test behavior analysis
- [ ] Test recommendations

### Phase 5b: Calendar Integration
- [ ] Set up Google Calendar OAuth
- [ ] Set up Microsoft Outlook OAuth
- [ ] Create calendar sync logic
- [ ] Build calendar UI component
- [ ] Test 2-way sync

### Phase 5c: Habit System UI
- [ ] Create habit tracker component
- [ ] Build habit management page
- [ ] Add habit reminders
- [ ] Test habit tracking

### Phase 5d: Deep Work Blocks
- [ ] Create deep work timer UI
- [ ] Build session review form
- [ ] Add deep work analytics
- [ ] Test focus mode

---

## Quick Reference Commands

### Local Development
```bash
npm run dev              # Start dev server
npx prisma studio       # Open database GUI
npm run typecheck        # Check TypeScript
npm run lint             # Lint code
npm run format           # Format code
```

### Git Workflow
```bash
git add .                               # Stage changes
git commit -m "message"                 # Commit
git push origin main                    # Push to GitHub
```

### Database
```bash
npx prisma migrate dev --name name      # Create migration
npx prisma generate                     # Regenerate client
npx prisma migrate reset                # Reset (deletes data!)
```

### Build & Deploy
```bash
npm run build            # Build for production
npm start                # Start production server
```

---

## Testing Checklist

### Local Testing
- [ ] Landing page loads
- [ ] Signup works
- [ ] Login works
- [ ] Dashboard displays metrics
- [ ] Tasks can be created
- [ ] Tasks can be updated
- [ ] Check-ins can be submitted
- [ ] XP awarded correctly
- [ ] Journal entries save
- [ ] Analytics calculate correctly

### Production Testing
- [ ] Production URL loads
- [ ] Signup works
- [ ] Data persists after reload
- [ ] Check-in data visible in Supabase
- [ ] No console errors
- [ ] Performance acceptable

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check DATABASE_URL in .env.local |
| "Prisma migrations failed" | Run `npx prisma migrate status` |
| "Port 3000 already in use" | Run `npm run dev -- -p 3001` |
| "TypeScript errors" | Run `npm run typecheck` then `npx prisma generate` |
| "NEXTAUTH not working" | Verify NEXTAUTH_SECRET is set and NEXTAUTH_URL matches domain |
| "Vercel build fails" | Check Vercel logs, ensure all env vars set |

---

## Success Criteria ✅

- [ ] Local dev server runs without errors
- [ ] Can sign up and see dashboard
- [ ] Check-in submission awards XP
- [ ] GitHub repo created and code pushed
- [ ] Vercel deployment successful
- [ ] Production signup/login works
- [ ] Production data persists in Supabase
- [ ] No console errors in production
- [ ] Documentation complete

---

## 🎉 You're Done!

Once all checkboxes are complete, your FocusFlow is:
- ✅ Fully functional locally
- ✅ Published on GitHub
- ✅ Deployed to Vercel
- ✅ Connected to Supabase
- ✅ Ready for production use

**Next: Read [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) to add AI Coach, Calendar Sync, Habits, etc.**

---

## 📞 Need Help?

- **Local Setup**: See [QUICK_START.md](./QUICK_START.md)
- **Full Setup**: See [SUPABASE_GITHUB_VERCEL_SETUP.md](./SUPABASE_GITHUB_VERCEL_SETUP.md)
- **Advanced Features**: See [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

Good luck! 🚀
