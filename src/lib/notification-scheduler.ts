// Notification Scheduler - Background job logic
// In production, this would run as a cron job or background worker

import { prisma } from "./prisma";

export async function sendHourlyCheckInReminders() {
  try {
    // Get all users with notifications enabled
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
      },
      include: {
        preferences: true,
      },
    });

    const currentHour = new Date().getHours();
    
    // Only send during work hours (9 AM - 5 PM)
    if (currentHour < 9 || currentHour >= 17) {
      return;
    }

    for (const user of users) {
      // Skip if user disabled push notifications
      if (user.preferences && !user.preferences.enablePushNotifications) {
        continue;
      }

      // Check if user has already checked in this hour
      const lastCheckIn = await prisma.checkIn.findFirst({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().setMinutes(0, 0, 0)),
          },
        },
      });

      if (!lastCheckIn) {
        // Create notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: "⏰ Hourly Check-In Reminder",
            message: "Time for your hourly productivity check-in! What did you accomplish this hour?",
            type: "CHECK_IN_REMINDER",
            actionUrl: "/dashboard",
          },
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
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
      },
      include: {
        preferences: true,
      },
    });

    const motivationalMessages = [
      "🌟 New day, new opportunities! Let's make today count!",
      "💪 You've got this! Start strong and stay consistent!",
      "🚀 Today is the perfect day to crush your goals!",
      "✨ Your productivity journey continues today. Let's go!",
      "🔥 Wake up with determination, go to bed with satisfaction!",
    ];

    for (const user of users) {
      if (user.preferences && !user.preferences.enableMotivationalMessages) {
        continue;
      }

      const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Good Morning!",
          message,
          type: "MOTIVATIONAL",
          actionUrl: "/dashboard",
        },
      });
    }

    console.log(`✅ Sent daily motivation to ${users.length} users`);
  } catch (error) {
    console.error("Error sending daily motivation:", error);
  }
}

export async function detectInactivity() {
  try {
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
      },
    });

    const currentHour = new Date().getHours();
    
    // Check during work hours
    if (currentHour < 10 || currentHour >= 17) {
      return;
    }

    for (const user of users) {
      // Get check-ins from last 3 hours
      const recentCheckIns = await prisma.checkIn.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
        },
      });

      if (recentCheckIns.length === 0) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: "⚠️ Inactivity Alert",
            message: "We haven't heard from you in a while. Stay on track with a quick check-in!",
            type: "INACTIVITY_ALERT",
            actionUrl: "/dashboard",
          },
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
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
      },
      include: {
        preferences: true,
      },
    });

    const milestones = [3, 7, 14, 30, 60, 100];

    for (const user of users) {
      if (user.preferences && !user.preferences.enableStreakAlerts) {
        continue;
      }

      if (milestones.includes(user.streak)) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: `🔥 ${user.streak}-Day Streak Milestone!`,
            message: `Incredible! You've maintained a ${user.streak}-day streak. Keep up the amazing consistency!`,
            type: "STREAK_MILESTONE",
            actionUrl: "/dashboard",
          },
        });

        // Award achievement
        await prisma.achievement.create({
          data: {
            userId: user.id,
            type: user.streak === 3 ? "STREAK_3" : user.streak === 7 ? "STREAK_7" : user.streak === 30 ? "STREAK_30" : "CONSISTENCY_MONTH",
            title: `${user.streak}-Day Streak`,
            description: `Maintained productivity for ${user.streak} consecutive days`,
            xpReward: user.streak * 10,
          },
        });

        // Add XP
        await prisma.user.update({
          where: { id: user.id },
          data: {
            xp: { increment: user.streak * 10 },
          },
        });
      }
    }

    console.log(`✅ Checked streak milestones for ${users.length} users`);
  } catch (error) {
    console.error("Error checking streak milestones:", error);
  }
}

export async function sendDailyDigest() {
  try {
    const users = await prisma.user.findMany({
      where: {
        notificationsEnabled: true,
      },
      include: {
        preferences: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      if (user.preferences && !user.preferences.enableDailyDigest) {
        continue;
      }

      // Get today's stats
      const [tasks, checkIns] = await Promise.all([
        prisma.task.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: today },
          },
        }),
        prisma.checkIn.findMany({
          where: {
            userId: user.id,
            createdAt: { gte: today },
          },
        }),
      ]);

      const completedTasks = tasks.filter((t: { status: string }) => t.status === "COMPLETED").length;
      const avgRating = checkIns.length > 0
        ? (checkIns.reduce((sum: number, ci: { productivityRating: number }) => sum + ci.productivityRating, 0) / checkIns.length).toFixed(1)
        : 0;

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "📊 Daily Summary",
          message: `Today: ${completedTasks} tasks completed, ${checkIns.length} check-ins, ${avgRating}/10 avg rating. Great work!`,
          type: "DAILY_SUMMARY",
          actionUrl: "/dashboard",
        },
      });
    }

    console.log(`✅ Sent daily digest to ${users.length} users`);
  } catch (error) {
    console.error("Error sending daily digest:", error);
  }
}
