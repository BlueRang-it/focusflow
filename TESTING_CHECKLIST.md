# 🧪 FocusFlow Pro - Testing Checklist

## Pre-Deployment Testing Guide

Use this checklist to verify all features before going live.

---

## 1. Authentication & Access Control

### Sign Up
- [ ] Navigate to `/auth/signup`
- [ ] Create new account with email/password
- [ ] Verify account is created in database
- [ ] Check redirect to dashboard after signup
- [ ] Verify session is active

### Login
- [ ] Navigate to `/auth/login`
- [ ] Login with existing credentials
- [ ] Verify successful authentication
- [ ] Check redirect to dashboard
- [ ] Verify "Welcome back" message shows correct name

### Logout
- [ ] Click logout button in navigation
- [ ] Verify redirect to login page
- [ ] Confirm session is cleared
- [ ] Try accessing `/dashboard` (should redirect to login)

---

## 2. Dashboard (Enhanced)

### Header
- [ ] User name displays correctly
- [ ] Date shows in correct format
- [ ] Notification bell is visible
- [ ] Check-in button works

### XP Progress Bar
- [ ] Level displays correctly
- [ ] XP amount shows
- [ ] Progress percentage calculates
- [ ] "XP to next level" is accurate

### Pace Indicator (New!)
- [ ] Shows current pace status (Ahead/On Track/Behind)
- [ ] Color-coded correctly (green/blue/red)
- [ ] Task count displays (X of Y tasks)
- [ ] Icon matches status (🚀/✅/⚠️)

### Workday Timer (New!)
- [ ] Shows hours and minutes remaining
- [ ] Updates in real-time (check after 1 minute)
- [ ] Shows "Workday Complete" after 5 PM
- [ ] Timer is accurate

### Next Priority Task (New!)
- [ ] Displays the highest priority incomplete task
- [ ] Shows "No tasks" if task list is empty
- [ ] Truncates long task names properly

### Stats Cards
- [ ] Tasks Completed shows correct count
- [ ] Check-ins Today updates when you check in
- [ ] Avg Rating calculates correctly
- [ ] Current Streak displays user's streak

### Progress Bar
- [ ] Daily progress percentage is accurate
- [ ] Color changes based on completion (red/yellow/green)
- [ ] Percentage label displays

### Motivational Message
- [ ] Shows context-aware message
- [ ] Changes based on pace status
- [ ] Different message on each reload

### Badges Section
- [ ] Shows "Complete achievements to earn badges" if none
- [ ] Displays earned badges in compact view
- [ ] Tooltip shows badge name on hover

### Quick Actions (New!)
- [ ] Habits button navigates to `/habits`
- [ ] Weekly Review button navigates to `/weekly-review`
- [ ] Settings button navigates to `/settings`
- [ ] Check In button opens modal

---

## 3. Check-In System

### Create Check-In
- [ ] Click "Check In" button
- [ ] Modal opens
- [ ] Fill out accomplishment (required)
- [ ] Select productivity rating (1-10)
- [ ] Choose mood
- [ ] Add blockers (optional)
- [ ] Add distractions (optional)
- [ ] Add notes (optional)
- [ ] Submit check-in

### Validation
- [ ] Cannot submit without accomplishment
- [ ] Rating must be 1-10
- [ ] Mood is required
- [ ] Success message appears

### After Submission
- [ ] Check-in count increases on dashboard
- [ ] User gains +10 XP
- [ ] Modal closes
- [ ] Dashboard refreshes

---

## 4. Tasks System

### Create Task
- [ ] Navigate to task section
- [ ] Create new task with title
- [ ] Set priority (LOW/MEDIUM/HIGH/URGENT)
- [ ] Add time estimate
- [ ] Set due date (optional)
- [ ] Add description (optional)

### Task List
- [ ] Tasks sorted by priority
- [ ] High priority tasks appear first
- [ ] Status labels visible
- [ ] Time estimates shown

### Complete Task
- [ ] Mark task as complete
- [ ] Task count updates on dashboard
- [ ] Progress bar increases
- [ ] Next priority task changes

### Edit/Delete
- [ ] Edit task details
- [ ] Delete task
- [ ] Confirmation dialog appears for delete

---

## 5. Habits System (New!)

### Navigate to Habits
- [ ] Click "Habits" in navigation or quick actions
- [ ] Page loads at `/habits`

### Create Habit
- [ ] Click "+ New Habit" button
- [ ] Modal opens
- [ ] Fill out habit name (required)
- [ ] Add description (optional)
- [ ] Select category (Health/Work/Learning/Personal/Social)
- [ ] Choose frequency (Daily/Weekly/Multiple Times Daily)
- [ ] Set target count if multiple times daily
- [ ] Create habit

### Habit Display
- [ ] Habit card shows name and category
- [ ] Frequency label displays correctly
- [ ] Current streak shown
- [ ] Streak color changes (gray/green/blue/purple) based on days

### Log Habit
- [ ] Click "Log" button
- [ ] Confirmation shows
- [ ] "+5 XP" message appears
- [ ] Streak increases by 1
- [ ] Total completed count increases

### Expand Habit Card
- [ ] Click "More" button
- [ ] Shows longest streak
- [ ] Shows total completed
- [ ] Shows status (Active/Paused)
- [ ] Edit and Delete buttons appear

### Edit Habit
- [ ] Click Edit
- [ ] Modify habit details
- [ ] Save changes
- [ ] Card updates

### Delete Habit
- [ ] Click Delete
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Habit removed from list

### Active vs Paused
- [ ] Active habits shown first
- [ ] Paused habits shown separately (if any)
- [ ] Paused habits slightly faded

---

## 6. Weekly Review (New!)

### Navigate to Weekly Review
- [ ] Click "Weekly Review" in navigation or quick actions
- [ ] Page loads at `/weekly-review`

### Create Review
- [ ] Click "+ New Review" button
- [ ] Modal opens with form
- [ ] Week dates auto-populated
- [ ] Satisfaction slider works (1-10)

### Fill Out Review
- [ ] What Worked Well (textarea)
- [ ] What Didn't Work (textarea)
- [ ] Improvements (textarea)
- [ ] Next Week Plan (textarea)
- [ ] Priorities (textarea)
- [ ] Focus Areas (textarea)

### Submit Review
- [ ] Click "Create Review (+50 XP)"
- [ ] Loading state appears
- [ ] Success message shows
- [ ] User gains +50 XP
- [ ] Modal closes

### View Review
- [ ] Review appears in list
- [ ] Week date range shown
- [ ] Satisfaction rating displayed
- [ ] Metrics shown (tasks, avg productivity, hours)
- [ ] AI Insights section visible
- [ ] All reflection fields display

### AI Insights
- [ ] Insights are generated automatically
- [ ] Multiple insights shown (tasks, productivity, check-ins, hours)
- [ ] Insights are contextual and helpful
- [ ] Formatted nicely with line breaks

---

## 7. Notifications (New!)

### Notification Bell
- [ ] Bell icon visible in navigation
- [ ] Unread count badge shows (if notifications exist)
- [ ] Badge is red with white text
- [ ] Click opens dropdown

### Notification Dropdown
- [ ] Dropdown appears below bell
- [ ] Shows "No notifications yet" if empty
- [ ] Lists recent notifications (max 10)
- [ ] Each notification has icon based on type
- [ ] Title and message shown
- [ ] Time ago displayed (e.g., "5m ago", "2h ago")

### Notification Types
- [ ] ⏰ Check-in Reminder
- [ ] 📋 Task Due
- [ ] 💪 Motivational
- [ ] 🏆 Achievement
- [ ] 🔥 Streak Milestone
- [ ] ⚠️ Fell Behind
- [ ] 📊 Daily Summary
- [ ] Custom notifications

### Mark as Read
- [ ] Click notification
- [ ] Unread indicator (blue dot) disappears
- [ ] Badge count decreases
- [ ] Background changes from blue to white

### Action URL
- [ ] Click notification with action URL
- [ ] Redirects to correct page
- [ ] Notification marked as read

### Close Dropdown
- [ ] Click outside dropdown
- [ ] Dropdown closes
- [ ] Click bell again to reopen

---

## 8. Settings (New!)

### Navigate to Settings
- [ ] Click "Settings" in navigation or quick actions
- [ ] Page loads at `/settings`

### Notification Settings
- [ ] Toggle Email Notifications
- [ ] Toggle Push Notifications
- [ ] Toggle Daily Digest
- [ ] Toggle Motivational Messages
- [ ] Toggle Streak Alerts
- [ ] All toggles work smoothly

### Productivity Preferences
- [ ] Select Productivity Style (Focused/Balanced/Flexible)
- [ ] Adjust Work Block Length (slider or input)
- [ ] Adjust Break Length (slider or input)
- [ ] Values validate (min/max)

### Appearance
- [ ] Select Theme (Light/Dark/System)
- [ ] Select Language (en/es/fr/de)
- [ ] Changes save correctly

### Save Settings
- [ ] Click "Save Settings" button
- [ ] Loading state appears
- [ ] Success message shows
- [ ] Settings persist on page reload

---

## 9. Navigation

### Navigation Bar
- [ ] Logo visible and clickable
- [ ] Navigation links shown (Dashboard, Habits, Weekly Review, Settings)
- [ ] Active page highlighted
- [ ] Hover states work

### Mobile Navigation
- [ ] Responsive on mobile devices
- [ ] Hamburger menu or horizontal scroll
- [ ] All links accessible

### User Section
- [ ] User name displayed
- [ ] User email shown (desktop)
- [ ] Logout button visible
- [ ] Logout works correctly

---

## 10. Analytics Page

### View Analytics
- [ ] Navigate to analytics (if separate page)
- [ ] Metrics display correctly
- [ ] Period filter works (week/month/all)
- [ ] Charts render properly

### Metrics
- [ ] Check-ins count
- [ ] Tasks completed
- [ ] Average rating
- [ ] Peak hour
- [ ] Hours logged
- [ ] Mood distribution

---

## 11. Gamification Features

### XP System
- [ ] Check-in: +10 XP
- [ ] Habit log: +5 XP
- [ ] Weekly review: +50 XP
- [ ] Task completion: (if implemented)
- [ ] XP displays in real-time

### Level System
- [ ] Level calculation correct (100 × 1.5^level)
- [ ] Level up happens automatically
- [ ] Progress bar updates
- [ ] "Level X" displays

### Achievement Toast
- [ ] Appears when achievement unlocked
- [ ] Shows achievement title
- [ ] Shows description
- [ ] Shows XP reward
- [ ] Auto-dismisses after 5 seconds
- [ ] Can be manually closed

### Badges
- [ ] Badges awarded for milestones
- [ ] Badge icons display correctly
- [ ] Compact view shows first 5 badges
- [ ] "+X more" indicator if >5 badges

### Streaks
- [ ] Daily streak increments
- [ ] Breaks if day is missed
- [ ] Milestone notifications (3, 7, 30 days)
- [ ] Longest streak tracked

---

## 12. API Endpoints Testing

### Test with Postman/Thunder Client

#### Check-ins
```
GET /api/check-ins
GET /api/check-ins?days=7
POST /api/check-ins
```

#### Tasks
```
GET /api/tasks
GET /api/tasks?status=COMPLETED
GET /api/tasks?date=2024-12-20
POST /api/tasks
PATCH /api/tasks/[id]
DELETE /api/tasks/[id]
```

#### Habits
```
GET /api/habits
GET /api/habits?isActive=true
POST /api/habits
PATCH /api/habits/[id]
DELETE /api/habits/[id]
POST /api/habits/[id]/log
```

#### Weekly Reviews
```
GET /api/weekly-reviews
GET /api/weekly-reviews?limit=5
POST /api/weekly-reviews
```

#### Notifications
```
GET /api/notifications
GET /api/notifications?isRead=false
POST /api/notifications
PATCH /api/notifications/[id]
DELETE /api/notifications/[id]
```

#### Preferences
```
GET /api/preferences
PUT /api/preferences
```

#### Analytics
```
GET /api/analytics
GET /api/analytics?period=week
GET /api/analytics?period=month
```

#### AI Coach
```
GET /api/ai-coach
POST /api/ai-coach
```

---

## 13. Database Integrity

### Verify Data
- [ ] Users table populated correctly
- [ ] Check-ins linked to users
- [ ] Tasks linked to users
- [ ] Habits linked to users
- [ ] Habit logs linked to habits
- [ ] Weekly reviews linked to users
- [ ] Notifications linked to users
- [ ] Preferences linked to users
- [ ] Analytics linked to users

### Relationships
- [ ] Cascade deletes work
- [ ] Foreign keys enforced
- [ ] Unique constraints work

---

## 14. Performance Testing

### Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] API responses < 500ms
- [ ] Smooth animations
- [ ] No console errors

### Large Data Sets
- [ ] Test with 100+ tasks
- [ ] Test with 50+ check-ins
- [ ] Test with 20+ habits
- [ ] Page remains responsive

---

## 15. Error Handling

### Network Errors
- [ ] API failure shows error message
- [ ] Retry mechanism works
- [ ] Graceful degradation

### Validation Errors
- [ ] Form validation messages clear
- [ ] Prevents invalid submissions
- [ ] Shows specific error messages

### Authentication Errors
- [ ] Unauthorized access redirects to login
- [ ] Token expiration handled
- [ ] Session timeout warning

---

## 16. Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Samsung Internet

---

## 17. Responsive Design

### Desktop (1920x1080)
- [ ] All elements visible
- [ ] No horizontal scroll
- [ ] Proper spacing

### Laptop (1366x768)
- [ ] Layout adapts
- [ ] Text readable
- [ ] No overflow

### Tablet (768x1024)
- [ ] Mobile nav active
- [ ] Cards stack properly
- [ ] Touch targets adequate

### Mobile (375x667)
- [ ] Single column layout
- [ ] Bottom nav accessible
- [ ] Forms usable

---

## 18. Security Testing

### Authentication
- [ ] Cannot access dashboard without login
- [ ] Cannot access other users' data
- [ ] Passwords hashed in database
- [ ] Session tokens secure

### Authorization
- [ ] API routes check authentication
- [ ] Users can only modify their own data
- [ ] Admin routes protected (if any)

### Data Validation
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled

---

## 19. Background Jobs (Future)

### Hourly Reminders
- [ ] Send at top of each hour (9-5)
- [ ] Only to users with notifications enabled
- [ ] Skip if already checked in

### Daily Motivation
- [ ] Send at 8 AM
- [ ] Different message each day
- [ ] Respect user preferences

### Inactivity Detection
- [ ] Detect 3+ hours without check-in
- [ ] Send nudge notification
- [ ] Only during work hours

### Streak Milestones
- [ ] Detect 3, 7, 30, 100 day streaks
- [ ] Send celebration notification
- [ ] Award achievement
- [ ] Add bonus XP

---

## 20. Deployment Verification

### After Deploying to Vercel

- [ ] Production URL loads
- [ ] All pages accessible
- [ ] Environment variables set correctly
- [ ] Database connection works
- [ ] No build errors in logs
- [ ] Static assets load
- [ ] API routes respond
- [ ] NextAuth works in production

---

## Summary Checklist

### Core Features
- [ ] Authentication (Login/Signup/Logout)
- [ ] Dashboard (Enhanced with all PRD features)
- [ ] Check-in System
- [ ] Task Management
- [ ] Habits System ✨ NEW
- [ ] Weekly Review ✨ NEW
- [ ] Notifications ✨ NEW
- [ ] Settings/Preferences ✨ NEW
- [ ] Analytics
- [ ] Gamification (XP/Levels/Badges)

### Technical
- [ ] All API endpoints working
- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Success messages shown

### UX/UI
- [ ] Responsive design
- [ ] Smooth animations
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Consistent styling

---

## 🎯 Test Result Tracking

**Date Tested**: _______________
**Tester**: _______________
**Environment**: [ ] Local [ ] Staging [ ] Production

**Pass Rate**: _____ / _____ tests passed

**Critical Issues Found**: _____
**Minor Issues Found**: _____

**Overall Status**: [ ] Ready for Launch [ ] Needs Fixes

---

## 📝 Notes

Use this section to document any issues, observations, or suggestions during testing:

```
Issue 1:
Description: 
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
Status: [ ] Open [ ] In Progress [ ] Fixed

Issue 2:
Description:
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
Status: [ ] Open [ ] In Progress [ ] Fixed
```

---

**Happy Testing! 🧪**

Once all tests pass, you're ready to launch FocusFlow Pro! 🚀
