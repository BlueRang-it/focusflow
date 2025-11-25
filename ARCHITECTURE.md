# FocusFlow - Architecture & Design Document

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                     │
│        (React Components + Next.js Pages/Components)        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              API LAYER (Next.js Routes)                     │
│  /api/auth, /api/tasks, /api/check-ins, /api/journal, etc  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          BUSINESS LOGIC LAYER (Utilities)                   │
│     lib/productivity.ts, streak calculations, scoring       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          DATA ACCESS LAYER (Prisma ORM)                     │
│            Database abstractions & queries                  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           DATABASE LAYER (PostgreSQL)                       │
│    Tables: User, Task, CheckIn, Journal, Analytics, etc     │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
User Signup
    ↓
Validate Credentials (Zod)
    ↓
Hash Password (bcryptjs)
    ↓
Create User in Database
    ↓
Initialize Analytics & Preferences
    ↓
Redirect to Login

User Login
    ↓
Validate Credentials (Zod)
    ↓
Compare Password Hash
    ↓
Generate JWT Token
    ↓
Create Session (NextAuth)
    ↓
Redirect to Dashboard
```

## 📊 Data Models & Relationships

### User Entity
```typescript
User {
  id: String (PK)
  email: String (UNIQUE)
  name: String
  password: String (hashed)
  xp: Int
  level: Int
  streak: Int
  longestStreak: Int
  
  // Relations
  tasks: Task[]
  checkIns: CheckIn[]
  journal: JournalEntry[]
  badges: Badge[]
  achievements: Achievement[]
  notifications: Notification[]
  preferences: UserPreferences
  analytics: Analytics
}
```

### Task Entity
```typescript
Task {
  id: String (PK)
  userId: String (FK)
  title: String
  priority: Priority (LOW|MEDIUM|HIGH|URGENT)
  status: TaskStatus (TODO|IN_PROGRESS|BLOCKED|COMPLETED|CANCELLED)
  timeEstimate: Int? (minutes)
  timeSpent: Int
  dueDate: DateTime?
  completedAt: DateTime?
  
  // Relations
  user: User
  checkIns: CheckIn[]
}
```

### CheckIn Entity
```typescript
CheckIn {
  id: String (PK)
  userId: String (FK)
  taskId: String? (FK)
  accomplishment: String
  productivityRating: Int (1-10)
  mood: Mood (VERY_UNHAPPY|UNHAPPY|NEUTRAL|HAPPY|VERY_HAPPY)
  blockers: String?
  distractions: String?
  notes: String?
  createdAt: DateTime
  
  // Relations
  user: User
  task: Task?
}
```

### Analytics Entity
```typescript
Analytics {
  id: String (PK)
  userId: String (UNIQUE FK)
  todayTasksCompleted: Int
  todayCheckIns: Int
  todayAverageRating: Float
  weekTasksCompleted: Int
  totalTasksCompleted: Int
  averageHourlyRating: Float
  peakHour: Int?
  
  // Relations
  user: User
  dailyStats: DailyStat[]
}
```

## 🎯 Core Features Implementation

### 1. Dashboard Real-Time Updates

**Flow:**
```
Dashboard Load
    ↓
Fetch User Data (User, Analytics)
    ↓
Fetch Today's Tasks
    ↓
Fetch Today's CheckIns
    ↓
Calculate Progress Metrics
    ↓
Generate Motivational Message
    ↓
Render Dashboard
    ↓
[Auto-refresh every 30 seconds]
```

**Key Metrics Calculated:**
- Daily progress % = (completed tasks / total tasks) * 100
- Average rating = sum of ratings / count of check-ins
- Hours logged = sum of task timeSpent / 60
- Pace status based on time of day vs. progress

### 2. Hourly Check-In System

**Flow:**
```
User Initiates Check-In
    ↓
Open CheckInModal
    ↓
User Fills Form:
  - Accomplishment (required)
  - Productivity Rating 1-10
  - Mood Selection
  - Blockers/Distractions (optional)
    ↓
Validate Input (Zod)
    ↓
Save to Database
    ↓
Award XP (10 XP + bonuses)
    ↓
Increment Check-In Count
    ↓
Update Streak (if applicable)
    ↓
Create Notification
    ↓
Refresh Dashboard
```

### 3. Streak Calculation

**Algorithm:**
```typescript
calculateStreak(userId: String): Int {
  let streak = 0
  let currentDate = TODAY
  
  while (true) {
    let checkIn = getCheckInForDate(userId, currentDate)
    if (!checkIn) break
    
    streak++
    currentDate = currentDate - 1 day
  }
  
  return streak
}
```

**Streak Milestones:**
- 3 days: 🔥 Badge
- 7 days: ⭐ Badge
- 30 days: 💪 Badge
- 100 days: 👑 Badge

### 4. Productivity Scoring

**Formula:**
```
Score = TaskComponent + RatingComponent + HoursComponent

TaskComponent = min(tasksCompleted * 10, 30)
RatingComponent = avgRating * 5  // 0-50 (1-10 scale)
HoursComponent = min((hoursLogged / goalHours) * 20, 20)

Total = 0-100
```

### 5. Analytics Engine

**Data Collection:**
```
Each Check-In
    ↓
Record: rating, mood, task completion
    ↓
Aggregate for Daily Summary
    ↓
Calculate Hourly Breakdown
    ↓
Identify Peak Hours
    ↓
Update Analytics Record
```

**Metrics Tracked:**
- Daily/Weekly/Monthly summaries
- Peak performance hours
- Mood distribution
- Task completion trends
- Average productivity rating
- Streak statistics

## 🎮 Gamification System

### XP System
```
Base XP:
  - Check-In: 10 XP
  - Task Completion: 20 XP
  - Perfect Productivity (9+ rating): +5 XP
  - Streak Milestone (3, 7, 30, 100): +50 XP

Level Progression:
  Level 1: 0 XP
  Level 2: 100 XP
  Level 3: 300 XP
  Level 4: 600 XP
  ... (increases by 100 for each level)
```

### Badge System
```
Badge Categories:
  - Streak Badges: 3-day, 7-day, 30-day, 100-day
  - Consistency Badges: Weekly/Monthly achievements
  - Performance Badges: High productivity scores
  - Milestone Badges: Task count milestones
  
Trigger Logic:
  On Check-In → Check for earned badges
  On Streak Update → Check for streak badges
  On Task Completion → Check for performance badges
```

### Achievement System
```
Achievement Types:
  - FIRST_TASK: Triggered on first task creation
  - FIRST_CHECK_IN: Triggered on first check-in
  - STREAK_3/7/30: Triggered at streak milestones
  - LEVEL_UP: Triggered on level progression
  - CONSISTENCY_WEEK/MONTH: Triggered on weekly/monthly consistency
  
XP Rewards:
  - Standard: 25 XP
  - Major (Streaks, Levels): 100 XP
  - Custom: Variable
```

## 🔔 Notification System

### Notification Types

```
NotificationType: Enum
  - CHECK_IN_REMINDER: Hourly reminder
  - TASK_DUE: Upcoming deadline
  - FELL_BEHIND: Pace warning
  - MOTIVATIONAL: Random encouragement
  - ACHIEVEMENT: Badge/Achievement unlocked
  - STREAK_MILESTONE: Streak achieved
  - DAILY_SUMMARY: End-of-day recap
  - INACTIVITY_ALERT: No check-in for 2+ hours
```

### Notification Triggers

```
Every Hour (if enabled):
  CHECK_IN_REMINDER
    ↓
Check if 2+ hours without check-in:
  INACTIVITY_ALERT
    ↓
Check if falling behind pace:
  FELL_BEHIND
    ↓
On streak milestone:
  STREAK_MILESTONE
    ↓
On achievement unlock:
  ACHIEVEMENT
```

## 🔒 Security Architecture

### Authentication
- **Method**: NextAuth.js v5 with JWT
- **Session**: Secure HTTP-only cookies
- **Password**: bcryptjs hashing (10 salt rounds)

### Authorization
- **Protected Routes**: /dashboard, /tasks, /journal, /analytics
- **API Guards**: All API routes check session
- **Data Isolation**: Queries scoped by userId

### Input Validation
- **Schema**: Zod for all inputs
- **Database**: Prisma prevents SQL injection
- **XSS**: React escapes JSX content

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next/Image component
- **Caching**: ISR for static content
- **Components**: Memoization for large lists

### Backend
- **Database Indexes**: On userId, createdAt
- **Query Optimization**: Prisma includes/select
- **API Routes**: Edge functions for auth
- **Caching**: Response headers set

### Database
- **Indexes**:
  ```sql
  INDEX (userId, createdAt)
  INDEX (userId, status)
  UNIQUE (userId, criterion)
  ```

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
    ↓
PostgreSQL (Local)
    ↓
npm run dev
    ↓
http://localhost:3000
```

### Production Environment
```
Git Repository (GitHub)
    ↓
Vercel/Railway/Heroku
    ↓
Prisma Migrations
    ↓
PostgreSQL (Cloud)
    ↓
https://focusflow.app
    ↓
CDN Distribution
```

## 📝 API Response Format

### Success Response
```json
{
  "data": { /* resource data */ },
  "status": "success",
  "timestamp": "2024-11-25T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error",
  "code": "ERROR_CODE",
  "timestamp": "2024-11-25T10:30:00Z"
}
```

## 🔄 Data Flow Example: Complete Check-In Process

```
1. User clicks "Check-In Now"
   └─ CheckInModal opens

2. User fills form and submits
   └─ Client-side validation (Zod)

3. POST /api/check-ins
   └─ Server-side validation
   └─ Authenticate session
   └─ Save to CheckIn table

4. Server Response:
   └─ Update User XP (+10)
   └─ Increment totalCheckIns
   └─ Calculate streak
   └─ Check for badges/achievements
   └─ Create notification

5. Return to Client:
   └─ Success response with check-in data
   └─ Refresh dashboard metrics
   └─ Display success message

6. Real-time Updates:
   └─ Dashboard reflects new stats
   └─ Streak counter updated
   └─ XP/level display updated
```

## 🎨 UI Component Hierarchy

```
App Root (SessionProvider)
├── Home Page
│   ├── Navigation
│   ├── Hero Section
│   ├── Features Grid
│   └── CTA Buttons
├── Auth Layout
│   ├── Login Page
│   └── Signup Page
├── Dashboard
│   ├── Header
│   ├── Motivational Card
│   ├── Stats Grid
│   ├── Task Progress
│   ├── Quick Actions
│   ├── Achievements
│   └── CheckInModal
├── Tasks Page
│   ├── Task List
│   ├── Task Form
│   └── Filters
├── Journal Page
│   ├── Search/Filter
│   └── Entry List
├── Analytics Page
│   ├── Charts
│   ├── Metrics
│   └── Filters
└── Settings Page
    ├── Profile Settings
    ├── Work Schedule
    └── Preferences
```

## 📦 State Management Strategy

### Server State (Preferred)
- Database queries via Prisma
- Server components with direct DB access
- API routes for mutations

### Client State (React)
- Form inputs (controlled components)
- Modal/UI state (open/close)
- Loading states
- Short-term cache

### Session State (NextAuth)
- Current user info
- Authentication status
- JWT token

---

**This architecture ensures scalability, maintainability, and performance.**
