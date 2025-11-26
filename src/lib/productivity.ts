import { supabase } from "@/lib/supabase";
import { startOfDay, endOfDay } from "date-fns";

type TaskLite = { status: string; timeSpent?: number; createdAt: Date; dueDate?: Date | null; priority: string };
type CheckInLite = { productivityRating: number; createdAt: Date };

export const calculateDailyProgress = async (userId: string) => {
  const today = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());

  const [tasksRes, checkInsRes, userRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("userId", userId)
      .gte("createdAt", today.toISOString())
      .lte("createdAt", endOfToday.toISOString()),
    supabase
      .from("check_ins")
      .select("*")
      .eq("userId", userId)
      .gte("createdAt", today.toISOString())
      .lte("createdAt", endOfToday.toISOString()),
    supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single(),
  ]);

  const tasks = tasksRes.data || [];
  const checkIns = checkInsRes.data || [];
  const user = userRes.data;

  const completedTasks = tasks.filter((t: TaskLite) => t.status === "COMPLETED").length;
  const totalTasks = tasks.length;
  const avgRating =
    checkIns.length > 0
      ? Math.round(
          (checkIns.reduce((sum: number, ci: CheckInLite) => sum + ci.productivityRating, 0) /
            checkIns.length) *
            10
        ) / 10
      : 0;

  return {
    completedTasks,
    totalTasks,
    progressPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    checkInCount: checkIns.length,
    averageRating: avgRating,
    hoursLogged:
      tasks.reduce((sum: number, t: TaskLite) => sum + (t.timeSpent || 0), 0) / 60,
    currentStreak: user?.streak || 0,
  };
};

export const calculatePace = async (
  userId: string,
  goalHours: number = 8
) => {
  const today = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());
  const now = new Date();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("userId", userId)
    .gte("createdAt", today.toISOString())
    .lte("createdAt", endOfToday.toISOString());
  
  if (!tasks) return { hoursLogged: 0, pace: "ON_TRACK", hoursRemaining: goalHours };

  const hoursLogged =
    tasks.reduce((sum: number, t: TaskLite) => sum + (t.timeSpent || 0), 0) / 60;

  // Calculate hours passed and hours remaining
  const workStart = new Date(today);
  const [startHour] = "09:00".split(":");
  workStart.setHours(parseInt(startHour), 0, 0, 0);

  const hoursElapsed = (now.getTime() - workStart.getTime()) / (1000 * 60 * 60);
  const hoursRemaining = 24 - hoursElapsed;

  const expectedProgress = (hoursElapsed / goalHours) * 100;
  const actualProgress = (hoursLogged / goalHours) * 100;

  const difference = actualProgress - expectedProgress;
  let paceStatus: "ahead" | "on-track" | "behind" = "on-track";

  if (difference > 10) paceStatus = "ahead";
  else if (difference < -10) paceStatus = "behind";

  return {
    hoursLogged,
    expectedProgress,
    actualProgress,
    difference,
    paceStatus,
    hoursRemaining: Math.max(0, hoursRemaining),
  };
};

export const calculateStreakAndAchievements = async (userId: string) => {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) return null;

  // Calculate streak
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: checkIns } = await supabase
      .from("check_ins")
      .select("*")
      .eq("userId", userId)
      .gte("createdAt", startOfDay.toISOString())
      .lte("createdAt", endOfDay.toISOString())
      .limit(1);
    
    const checkIn = checkIns?.[0];

    if (!checkIn) break;

    streak++;
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  }

  // Update streak in user record
  if (streak > user.longestStreak) {
    await supabase
      .from("users")
      .update({ longestStreak: streak })
      .eq("id", userId);
  }

  return { currentStreak: streak, longestStreak: user.longestStreak };
};

export const generateMotivationalMessage = (
  paceStatus: string,
  avgRating: number,
  streak: number
) => {
  const messages = {
    behind: [
      "You're a bit behind, but you've got this! Let's focus and catch up.",
      "Time to shift into gear! You can turn this around.",
      "Don't worry, consistency beats perfection. Get back on track!",
    ],
    "on-track": [
      "Great work! You're right on pace!",
      "You're doing amazing! Keep it up!",
      "Momentum is on your side. Let's keep this going!",
    ],
    ahead: [
      "Outstanding! You're crushing your goals!",
      "You're flying ahead! This is fantastic!",
      "Wow, you're absolutely dominating today!",
    ],
  };

  const streakMessages = {
    "3": "🔥 3-day streak! You're building momentum!",
    "7": "🌟 1 week of consistency! That's incredible!",
    "30": "💪 30-day streak! You're unstoppable!",
    "100": "👑 100-day streak! You're a legend!",
  };

  const msgGroup = (messages as Record<string, string[]>)[paceStatus] || messages["on-track"];
  const randomMsg = msgGroup[Math.floor(Math.random() * msgGroup.length)];

  let streakMsg = "";
  if (streak > 0 && [3, 7, 30, 100].includes(streak)) {
    streakMsg = streakMessages[streak as unknown as keyof typeof streakMessages];
  }

  return `${randomMsg}${streakMsg ? " " + streakMsg : ""}`;
};

export const getTopPriorityTask = async (userId: string) => {
  const today = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("userId", userId)
    .neq("status", "COMPLETED")
    .gte("createdAt", today.toISOString())
    .lte("createdAt", endOfToday.toISOString());
  
  if (!tasks || tasks.length === 0) return null;

  const weight: Record<string, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, URGENT: 3 } as const;
  const sorted = tasks.sort((a: TaskLite, b: TaskLite) => {
    const prioDiff = (weight[b.priority as keyof typeof weight] ?? 0) - (weight[a.priority as keyof typeof weight] ?? 0);
    if (prioDiff !== 0) return prioDiff;
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    if (aDue !== bDue) return aDue - bDue;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return sorted[0] || null;
};

export const calculateProductivityScore = (
  completedTasks: number,
  avgRating: number,
  hoursLogged: number,
  goalHours: number = 8
) => {
  const taskScore = Math.min(completedTasks * 10, 30);
  const ratingScore = avgRating * 5; // 0-50
  const hoursScore = Math.min((hoursLogged / goalHours) * 20, 20); // 0-20

  const totalScore = taskScore + ratingScore + hoursScore;
  return Math.round(totalScore);
};
