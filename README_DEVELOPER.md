# 👨‍💻 FocusFlow Pro - Developer Guide

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
npx prisma db push

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 📁 Project Structure

```
focusflow-pro/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (protected)/        # Protected routes layout
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── check-ins/      # Check-in CRUD
│   │   │   ├── tasks/          # Task management
│   │   │   ├── habits/         # Habit tracking ✨ NEW
│   │   │   ├── weekly-reviews/ # Weekly reviews ✨ NEW
│   │   │   ├── notifications/  # Notifications ✨ NEW
│   │   │   ├── preferences/    # User settings ✨ NEW
│   │   │   ├── analytics/      # Analytics data
│   │   │   ├── ai-coach/       # AI coaching
│   │   │   └── journal/        # Production journal
│   │   ├── auth/               # Auth pages (login/signup)
│   │   ├── dashboard/          # Main dashboard ✨ ENHANCED
│   │   ├── habits/             # Habits page ✨ NEW
│   │   ├── weekly-review/      # Weekly review page ✨ NEW
│   │   ├── settings/           # Settings page ✨ NEW
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── auth/                   # NextAuth configuration
│   ├── components/             # React components
│   │   ├── Navigation.tsx      # Global nav ✨ NEW
│   │   ├── NotificationBell.tsx # Notifications ✨ NEW
│   │   ├── HabitCard.tsx       # Habit card ✨ NEW
│   │   ├── BadgeDisplay.tsx    # Badge showcase ✨ NEW
│   │   ├── XPProgressBar.tsx   # XP/Level bar ✨ NEW
│   │   ├── AchievementToast.tsx # Achievement popup ✨ NEW
│   │   ├── CheckInModal.tsx    # Check-in form
│   │   ├── Card.tsx            # Card components
│   │   ├── Button.tsx          # Button component
│   │   └── Progress.tsx        # Progress components
│   ├── lib/                    # Utility libraries
│   │   ├── prisma.ts           # Prisma client
│   │   ├── productivity.ts     # Productivity calculations
│   │   ├── notification-scheduler.ts # Background jobs ✨ NEW
│   │   └── env-check.ts        # Environment validation
│   └── types/                  # TypeScript types
│       └── next-auth.d.ts      # NextAuth types
├── prisma/
│   └── schema.prisma           # Database schema (30+ models)
├── public/                     # Static assets
├── DEPLOYMENT_GUIDE.md         # How to deploy ✨ NEW
├── TESTING_CHECKLIST.md        # Testing guide ✨ NEW
├── FINAL_SUMMARY.md            # What was built ✨ NEW
├── PRD_IMPLEMENTATION_ANALYSIS.md # Gap analysis ✨ NEW
└── package.json                # Dependencies
```

---

## 🗄️ Database Schema Overview

### Core Models
- `User` - User accounts with gamification (XP, level, streak)
- `Account`, `Session` - NextAuth authentication
- `Task` - Task management with priorities
- `CheckIn` - Hourly productivity check-ins
- `JournalEntry` - Production journal
- `Analytics`, `DailyStat` - Analytics data

### Gamification
- `Badge` - Earned badges
- `Achievement` - Unlocked achievements
- `Milestone` - Progress milestones

### New Features ✨
- `Habit`, `HabitLog` - Habit tracking system
- `WeeklyReview` - Weekly reflection & planning
- `Notification` - User notifications
- `Reminder` - Scheduled reminders
- `UserPreferences` - User settings

### Advanced (Database Ready)
- `Goal`, `Project` - Goals hierarchy
- `DeepWorkBlock` - Deep work sessions
- `TimeTrackingEntry` - Automatic time tracking
- `MoodEntry` - Mood & energy tracking
- `FocusPersonality` - Personality analysis
- `AICoachSession` - AI coaching sessions
- `ScheduledTask` - Auto-scheduling
- `CalendarEvent` - Calendar integration

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/signup         - Create account
POST /api/auth/[...nextauth]  - NextAuth handlers
GET  /api/session             - Get session info
```

### Check-ins
```
GET  /api/check-ins           - List check-ins
POST /api/check-ins           - Create check-in (+10 XP)
```

### Tasks
```
GET    /api/tasks             - List tasks (filter by status/date)
POST   /api/tasks             - Create task
PATCH  /api/tasks/[id]        - Update task
DELETE /api/tasks/[id]        - Delete task
```

### Habits ✨ NEW
```
GET    /api/habits            - List habits
POST   /api/habits            - Create habit
PATCH  /api/habits/[id]       - Update habit
DELETE /api/habits/[id]       - Delete habit
POST   /api/habits/[id]/log   - Log habit completion (+5 XP)
```

### Weekly Reviews ✨ NEW
```
GET  /api/weekly-reviews      - List reviews
POST /api/weekly-reviews      - Create review (+50 XP, AI insights)
```

### Notifications ✨ NEW
```
GET    /api/notifications     - List notifications
POST   /api/notifications     - Create notification
PATCH  /api/notifications/[id] - Mark as read
DELETE /api/notifications/[id] - Delete notification
```

### Preferences ✨ NEW
```
GET /api/preferences          - Get user preferences
PUT /api/preferences          - Update preferences
```

### Analytics
```
GET /api/analytics?period=week - Get analytics (week/month/all)
```

### AI Coach
```
GET  /api/ai-coach            - List sessions
POST /api/ai-coach            - Create coaching session
```

### Journal
```
GET  /api/journal             - List entries
POST /api/journal             - Create entry
```

---

## 🎨 Component Library

### Layout Components
- `Navigation` - Global navigation bar
- `Card`, `CardHeader`, `CardContent` - Card containers
- `Button` - Styled button component

### Dashboard Components
- `StatBox` - Metric display boxes
- `ProgressBar` - Progress indicators
- `CheckInModal` - Check-in form modal

### Gamification Components ✨ NEW
- `XPProgressBar` - Level progress with XP
- `BadgeDisplay` - Badge showcase (compact/full)
- `AchievementToast` - Achievement notifications
- `NotificationBell` - Notification dropdown

### Feature Components ✨ NEW
- `HabitCard` - Habit tracking card with streaks

---

## 🚀 Features by Page

### `/dashboard` - Enhanced Dashboard ✨
**PRD Requirements**: ✅ All implemented
- Real-time productivity dashboard
- Pace indicator (Ahead/On Track/Behind)
- Workday time remaining
- Next priority task display
- XP progress bar with level
- Notification bell integration
- Daily stats & progress
- Motivational messages
- Quick action buttons
- Badge showcase

### `/habits` - Habits System ✨ NEW
**PRD Section 5.8**: ✅ Complete
- Create/edit/delete habits
- Category organization
- Frequency options (Daily/Weekly/Multiple)
- Automatic streak tracking
- Log habit completion
- XP rewards (+5 per log)
- Active/paused status

### `/weekly-review` - Weekly Review ✨ NEW
**PRD Section 5.9**: ✅ Complete
- Structured reflection (What worked, What didn't)
- Improvements & planning
- Auto-calculated metrics
- AI-generated insights
- Satisfaction rating
- XP rewards (+50 per review)
- Review history

### `/settings` - User Preferences ✨ NEW
**PRD Section 5.10**: ✅ Complete
- Notification preferences
- Productivity style settings
- Work block & break length
- Theme selection
- Language options

---

## 🎯 Gamification System

### XP Rewards
| Action | XP Gained |
|--------|-----------|
| Check-in | +10 XP |
| Habit log | +5 XP |
| Weekly review | +50 XP |
| Streak milestone | +10-100 XP |

### Level Calculation
```typescript
XP for level N = 100 × 1.5^(N-1)

Level 1: 0-100 XP
Level 2: 100-150 XP
Level 3: 150-225 XP
Level 4: 225-337 XP
Level 5: 337-506 XP
...
```

### Achievements
- First Task
- First Check-in
- 3/7/30-Day Streaks
- Level Up
- Perfect Productivity
- Consistency Week/Month

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Building
npm run build            # Production build
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check (if configured)

# Testing
npm test                 # Run tests (if configured)
```

---

## 🌍 Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Optional
SUPABASE_SERVICE_ROLE_KEY="..."
NODE_ENV="development"
```

---

## 🔐 Authentication Flow

1. User visits protected route
2. Middleware checks session
3. If no session → redirect to `/auth/login`
4. User logs in via NextAuth
5. Session created
6. Redirect to originally requested page

---

## 📊 Data Flow

### Check-in Creation
```
User → CheckInModal → POST /api/check-ins → Prisma → Database
                    → Update user XP (+10)
                    → Update totalCheckIns counter
                    → Return success
                    → Refresh dashboard
```

### Habit Logging
```
User → HabitCard → POST /api/habits/[id]/log → Prisma
                 → Calculate new streak
                 → Update habit stats
                 → Award +5 XP
                 → Return updated habit
                 → Refresh habits list
```

### Weekly Review with AI
```
User → Form → POST /api/weekly-reviews → Fetch week data
            → Calculate metrics
            → Generate AI insights
            → Award +50 XP
            → Return review
            → Display with insights
```

---

## 🎨 Styling

### Tailwind Classes Used
- Layout: `flex`, `grid`, `container`
- Spacing: `p-*`, `m-*`, `gap-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Effects: `hover:`, `transition-*`, `shadow-*`
- Responsive: `md:`, `lg:`, `sm:`

### Color Scheme
- Primary: Blue (`blue-600`)
- Success: Green (`green-600`)
- Warning: Yellow (`yellow-500`)
- Danger: Red (`red-600`)
- Neutral: Gray (`gray-*`)

---

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed
```bash
# Solution
1. Check DATABASE_URL is correct
2. Verify Supabase project is active
3. Run: npx prisma db push
```

### Issue: NextAuth Error
```bash
# Solution
1. Verify NEXTAUTH_URL matches current URL
2. Regenerate NEXTAUTH_SECRET
3. Clear browser cookies
```

### Issue: Module Not Found
```bash
# Solution
rm -rf node_modules .next
npm install
npm run dev
```

### Issue: Prisma Client Error
```bash
# Solution
npx prisma generate
npm run dev
```

---

## 📈 Performance Tips

1. **Database**
   - Use indexes (already in schema)
   - Enable connection pooling
   - Use Supabase's pooler URL

2. **API Routes**
   - Keep responses small
   - Use pagination
   - Cache frequently accessed data

3. **Frontend**
   - Use React.memo for expensive components
   - Lazy load heavy components
   - Optimize images with Next.js Image

---

## 🧪 Testing

See `TESTING_CHECKLIST.md` for comprehensive testing guide.

Quick smoke test:
```bash
# 1. Start dev server
npm run dev

# 2. Test these flows:
- Sign up new user
- Create a task
- Log a check-in
- Create a habit
- Log habit completion
- Create weekly review
- Change settings

# 3. Check database
npx prisma studio
```

---

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **State**: React hooks (useState, useEffect)
- **Date**: date-fns

---

## 🔄 Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create PR on GitHub
# After review, merge to main
```

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

---

## 📖 Documentation

- `README.md` - Project overview
- `PRD_IMPLEMENTATION_ANALYSIS.md` - What's implemented vs PRD
- `IMPLEMENTATION_COMPLETE.md` - What was built this session
- `DEPLOYMENT_GUIDE.md` - How to deploy
- `TESTING_CHECKLIST.md` - Testing guide
- `FINAL_SUMMARY.md` - Executive summary
- `README_DEVELOPER.md` - This file

---

## 🤝 Contributing

1. Read the PRD to understand requirements
2. Check `PRD_IMPLEMENTATION_ANALYSIS.md` for what's left
3. Create feature branch
4. Implement feature
5. Add tests
6. Update documentation
7. Submit PR

---

## 🚀 Deployment

See `DEPLOYMENT_GUIDE.md` for complete instructions.

Quick deploy:
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy on Vercel
- Connect repository
- Add environment variables
- Deploy

# 3. Setup cron jobs for notifications
- Add vercel.json
- Create cron endpoints
```

---

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: Check docs folder
- **Database**: Supabase Dashboard
- **Deployment**: Vercel Dashboard

---

## ✅ Development Checklist

Before pushing code:
- [ ] Code compiles (`npm run build`)
- [ ] No TypeScript errors
- [ ] Tested locally
- [ ] Database schema up to date
- [ ] Environment variables documented
- [ ] Comments added for complex logic
- [ ] Console.logs removed
- [ ] Git commit message follows convention

---

**Happy Coding! 🚀**

Built with ❤️ using Next.js, React, and TypeScript
