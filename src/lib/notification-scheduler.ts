// Notification Scheduler - Background job logic
// In production, this would run as a cron job or background worker

import { supabase } from "./supabase";

export async function sendHourlyCheckInReminders() {
  try {
    // Get all users with notifications enabled
    const { data: users } = await supabase
      .from("users")
      .select(`
        *,
        preferences:user_preferences(*)
      `)
      .eq("notificationsEnabled", true);
    
    if (!users) return;

    const currentHour = new Date().getHours();
    
    // Only send during work hours (9 AM - 5 PM)
    if (currentHour < 9 || currentHour >= 17) {
      return;
    }

    for (const user of users) {
      // Skip if user disabled push notifications
      const prefs = Array.isArray(user.preferences) ? user.preferences[0] : user.preferences;
      if (prefs && !prefs.enablePushNotifications) {
        continue;
      }

      // Check if user has already checked in this hour
      const { data: checkIns } = await supabase
        .from("check_ins")
        .select("*")
        .eq("userId", user.id)
        .gte("createdAt", new Date(new Date().setMinutes(0, 0, 0)).toISOString())
        .limit(1);

      if (!checkIns || checkIns.length === 0) {
        // Create notification
        await supabase
          .from("notifications")
          .insert({
            userId: user.id,
            title: "⏰ Hourly Check-In Reminder",
            message: "Time for your hourly productivity check-in! What did you accomplish this hour?",
            type: "CHECK_IN_REMINDER",
            actionUrl: "/dashboard",
          });
      }
    }

    console.log(`✅ Sent hourly reminders to ${users.length} users`);
  } catch (error) {
    console.error("Error sending hourly reminders:", error);
  }
}

export async function sendDailyMotivation() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select(`
        *,
        preferences:user_preferences(*)
      `)
      .eq("notificationsEnabled", true);
    
    if (!users) return;

    const motivationalMessages = [
      "🌟 New day, new opportunities! Let's make today count!",
      "💪 You've got this! Start strong and stay consistent!",
      "🚀 Today is the perfect day to crush your goals!",
      "✨ Your productivity journey continues today. Let's go!",
      "🔥 Wake up with determination, go to bed with satisfaction!",
    ];

    for (const user of users) {
      const prefs = Array.isArray(user.preferences) ? user.preferences[0] : user.preferences;
      if (prefs && !prefs.enableMotivationalMessages) {
        continue;
      }

      const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      await supabase
        .from("notifications")
        .insert({
          userId: user.id,
          title: "Good Morning!",
          message,
          type: "MOTIVATIONAL",
          actionUrl: "/dashboard",
        });
    }

    console.log(`✅ Sent daily motivation to ${users.length} users`);
  } catch (error) {
    console.error("Error sending daily motivation:", error);
  }
}

export async function detectInactivity() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("notificationsEnabled", true);
    
    if (!users) return;

    const currentHour = new Date().getHours();
    
    // Check during work hours
    if (currentHour < 10 || currentHour >= 17) {
      return;
    }

    for (const user of users) {
      // Get check-ins from last 3 hours
      const { data: recentCheckIns } = await supabase
        .from("check_ins")
        .select("*")
        .eq("userId", user.id)
        .gte("createdAt", new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString());

      if (!recentCheckIns || recentCheckIns.length === 0) {
        await supabase
          .from("notifications")
          .insert({
            userId: user.id,
            title: "⚠️ Inactivity Alert",
            message: "We haven't heard from you in a while. Stay on track with a quick check-in!",
            type: "INACTIVITY_ALERT",
            actionUrl: "/dashboard",
          });
      }
    }

    console.log(`✅ Checked inactivity for ${users.length} users`);
  } catch (error) {
    console.error("Error detecting inactivity:", error);
  }
}

export async function checkStreakMilestones() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select(`
        *,
        preferences:user_preferences(*)
      `)
      .eq("notificationsEnabled", true);
    
    if (!users) return;

    const milestones = [3, 7, 14, 30, 60, 100];

    for (const user of users) {
      const prefs = Array.isArray(user.preferences) ? user.preferences[0] : user.preferences;
      if (prefs && !prefs.enableStreakAlerts) {
        continue;
      }

      if (milestones.includes(user.streak)) {
        await supabase
          .from("notifications")
          .insert({
            userId: user.id,
            title: `🔥 ${user.streak}-Day Streak Milestone!`,
            message: `Incredible! You've maintained a ${user.streak}-day streak. Keep up the amazing consistency!`,
            type: "STREAK_MILESTONE",
            actionUrl: "/dashboard",
          });

        // Award achievement
        await supabase
          .from("achievements")
          .insert({
            userId: user.id,
            type: user.streak === 3 ? "STREAK_3" : user.streak === 7 ? "STREAK_7" : user.streak === 30 ? "STREAK_30" : "CONSISTENCY_MONTH",
            title: `${user.streak}-Day Streak`,
            description: `Maintained productivity for ${user.streak} consecutive days`,
            xpReward: user.streak * 10,
          });

        // Add XP
        await supabase
          .from("users")
          .update({
            xp: (user.xp || 0) + (user.streak * 10),
          })
          .eq("id", user.id);
      }
    }

    console.log(`✅ Checked streak milestones for ${users.length} users`);
  } catch (error) {
    console.error("Error checking streak milestones:", error);
  }
}

export async function sendDailyDigest() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select(`
        *,
        preferences:user_preferences(*)
      `)
      .eq("notificationsEnabled", true);
    
    if (!users) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      const prefs = Array.isArray(user.preferences) ? user.preferences[0] : user.preferences;
      if (prefs && !prefs.enableDailyDigest) {
        continue;
      }

      // Get today's stats
      const [tasksRes, checkInsRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .eq("userId", user.id)
          .gte("createdAt", today.toISOString()),
        supabase
          .from("check_ins")
          .select("*")
          .eq("userId", user.id)
          .gte("createdAt", today.toISOString()),
      ]);

      const tasks = tasksRes.data || [];
      const checkIns = checkInsRes.data || [];

      const completedTasks = tasks.filter((t: { status: string }) => t.status === "COMPLETED").length;
      const avgRating = checkIns.length > 0
        ? (checkIns.reduce((sum: number, ci: { productivityRating: number }) => sum + ci.productivityRating, 0) / checkIns.length).toFixed(1)
        : 0;

      await supabase
        .from("notifications")
        .insert({
          userId: user.id,
          title: "📊 Daily Summary",
          message: `Today: ${completedTasks} tasks completed, ${checkIns.length} check-ins, ${avgRating}/10 avg rating. Great work!`,
          type: "DAILY_SUMMARY",
          actionUrl: "/dashboard",
        });
    }

    console.log(`✅ Sent daily digest to ${users.length} users`);
  } catch (error) {
    console.error("Error sending daily digest:", error);
  }
}
