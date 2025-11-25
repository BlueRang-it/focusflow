# FocusFlow

🎯 **AI-powered productivity and personal growth platform** designed to help users overcome procrastination, stay motivated, and achieve their daily, weekly, and long-term goals.

FocusFlow is a comprehensive platform that combines:
- Real-time productivity tracking
- Hourly check-in system
- Smart task management
- Production journal
- Deep productivity analytics
- Anti-laziness motivation engine
- Gamification system (XP, badges, streaks)
- Advanced AI features (coming soon)

---

## 🚀 Quick Start

Get running in 5 minutes:

```bash
# 1. Clone or navigate to project
cd focusflow

# 2. Install dependencies
npm install

# 3. Create .env.local with Supabase credentials
# (See QUICK_START.md for details)

# 4. Setup database
npx prisma migrate dev --name init

# 5. Start development server
npm run dev

# Visit http://localhost:3000
```

👉 **See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-minute local setup guide |
| **[SUPABASE_GITHUB_VERCEL_SETUP.md](./SUPABASE_GITHUB_VERCEL_SETUP.md)** | Complete setup: Supabase → GitHub → Vercel |
| **[ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)** | 16 professional features & implementation roadmap |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System design, data models, API flows |
| **[FEATURES.md](./FEATURES.md)** | Feature implementation guide with code examples |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Complete project status & statistics |

---

## ✨ Core Features

### 1. Real-Time Productivity Dashboard
- Live productivity status
- Daily task progress
- Current streak counter
- Hourly check-in count
- Motivational messages

### 2. Hourly Check-In System
- Guided modal workflow
- Accomplishment logging
- Productivity rating (1-10)
- Mood selection
- Automatic XP rewards

### 3. Smart Task Management
- Create tasks with priorities
- Time estimation
- Task status tracking
- Due date assignment
- Automatic prioritization

### 4. Productivity Journal
- Check-in history
- Search & filter
- Mood tracking
- Lessons learned
- Tomorrow's planning

### 5. Deep Analytics
- Daily/weekly/monthly summaries
- Productivity scoring (0-100)
- Task completion rate analysis
- Peak performance hours
- Streak statistics

### 6. Gamification
- XP system
- Level progression
- Achievement badges
- Streak tracking
- Performance scoring

---

## 🎯 Advanced Features (Coming Soon)

See [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for full details:

1. **🤖 AI Productivity Coach** - Behavior analysis & predictions
2. **⏰ Dynamic Auto-Scheduling** - Motion app-like scheduling
3. **🧠 Deep Work Blocks** - Focused session management
4. **📊 Automatic Time Tracking** - RescueTime-style tracking
5. **🎭 Habit System** - Daily/weekly habit tracking
6. **🎯 Goal Hierarchy** - Goals → Projects → Tasks
7. **😊 Mood & Energy Tracking** - Burnout detection
8. **📋 Weekly Reviews** - Guided reflection system
9. **👥 Collaboration** - Share tasks with teammates
10. **📅 Calendar Integration** - Google Calendar & Outlook sync
11. **🔥 Focus Mode** - Zen mode with distraction blocking
12. **🏆 Social Motivation** - Leaderboards & challenges
13. **📊 Data Visualization** - CEO-level analytics
14. **🧬 Focus Personality** - Identify your productivity style
15. **🧠 Knowledge Assistant** - AI journal analysis
16. **📬 Daily Briefings** - Morning & evening summaries

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15+ (App Router)
- React 19+
- TypeScript 5+
- Tailwind CSS 4+
- Chart.js (analytics)

**Backend**
- Next.js API Routes
- Prisma ORM 7+
- NextAuth.js v5

**Database**
- PostgreSQL (via Supabase)
- 15+ Prisma models
- Full schema defined

**Deployment**
- Vercel (recommended)
- GitHub integration
- Supabase PostgreSQL

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Setup Steps

1. **Clone/Navigate to Project**
   ```bash
   cd focusflow
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create project at [supabase.com](https://supabase.com)
   - Get connection string & API keys
   - Add to `.env.local`

4. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit **http://localhost:3000**

---

## 📁 Project Structure

```
focusflow/
├── src/
│   ├── app/
│   │   ├── api/              # 12+ API endpoints
│   │   ├── auth/             # Login & signup pages
│   │   ├── dashboard/        # Main dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable UI components
│   ├── auth/                 # NextAuth configuration
│   └── lib/                  # Utilities & helpers
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── docs/
    ├── QUICK_START.md
    ├── SUPABASE_GITHUB_VERCEL_SETUP.md
    ├── ADVANCED_FEATURES.md
    └── ARCHITECTURE.md
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Set environment variables
5. Deploy!

👉 **See [SUPABASE_GITHUB_VERCEL_SETUP.md](./SUPABASE_GITHUB_VERCEL_SETUP.md) for detailed instructions**

---

## 📊 Database Schema

15+ Models including:
- **User** - Profile & gamification
- **Task** - Task management
- **CheckIn** - Hourly tracking
- **JournalEntry** - Reflection
- **Habit** - Habit tracking
- **Goal** - High-level objectives
- **Project** - Mid-level projects
- **DeepWorkBlock** - Focused sessions
- **MoodEntry** - Mood & energy
- **WeeklyReview** - Reflections
- **FocusPersonality** - Analysis
- **AICoachSession** - AI insights
- **ScheduledTask** - Auto-scheduling
- **CalendarEvent** - Calendar sync
- **Analytics** - Productivity metrics

---

## 🔑 Key Features

✅ **Secure Authentication**
- NextAuth.js with password hashing
- Protected API routes
- Session management

✅ **Real-Time Metrics**
- Live dashboard updates
- Productivity scoring
- Streak tracking

✅ **Comprehensive Analytics**
- Daily/weekly/monthly summaries
- Mood distribution
- Peak hours analysis
- Trend tracking

✅ **Gamification**
- XP rewards (+10 per check-in)
- Level progression
- Achievement badges
- Streak milestones

✅ **Responsive Design**
- Mobile-friendly
- Dark mode ready
- Accessible components

---

## 🧪 Testing

```bash
# TypeScript check
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

---

## 🗄️ Database Management

```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name feature_name

# Push schema changes
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

---

## 🎯 Development Workflow

```bash
# Start dev server (auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Format code
npm run format

# Type check
npm run typecheck
```

---

## 🚨 Troubleshooting

### "Cannot connect to database"
```bash
# Verify connection string in .env.local
# Check Supabase project is running
npx prisma db execute --stdin < /dev/null
```

### "Prisma migrations failed"
```bash
npx prisma migrate status
npx prisma migrate reset  # WARNING: deletes data
```

### "TypeScript errors"
```bash
npm run typecheck
npx prisma generate
```

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `GET /api/session` - Get current session

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Check-Ins
- `GET /api/check-ins` - List check-ins
- `POST /api/check-ins` - Submit check-in

### Analytics
- `GET /api/analytics` - Get metrics

---

## 🤝 Contributing

This is a personal project, but feel free to fork and build upon it!

---

## 📝 License

MIT - Feel free to use for personal or commercial projects

---

## 🙋 Support

- 📖 Check documentation files
- 🐛 Review [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for implementation guides
- 💬 Refer to [SUPABASE_GITHUB_VERCEL_SETUP.md](./SUPABASE_GITHUB_VERCEL_SETUP.md) for deployment help

---

## 🎉 Ready to Get Started?

1. Follow [QUICK_START.md](./QUICK_START.md) for 5-minute local setup
2. Or follow [SUPABASE_GITHUB_VERCEL_SETUP.md](./SUPABASE_GITHUB_VERCEL_SETUP.md) for full deployment

**Let's build something amazing! 🚀**
