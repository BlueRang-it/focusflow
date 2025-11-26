"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar, StatBox } from "@/components/Progress";
import { CheckInModal } from "@/components/CheckInModal";
import NotificationBell from "@/components/NotificationBell";
import BadgeDisplay from "@/components/BadgeDisplay";
import XPProgressBar from "@/components/XPProgressBar";
import AchievementToast from "@/components/AchievementToast";
import { format } from "date-fns";

interface DailyProgress {
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  checkInCount: number;
  averageRating: number;
  hoursLogged: number;
  currentStreak: number;
}

interface Badge {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  criterion: string;
  earnedAt: string;
}

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate?: string | null;
}

interface UserData {
  level: number;
  xp: number;
  streak: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [workdayRemaining, setWorkdayRemaining] = useState("");
  const [paceStatus, setPaceStatus] = useState<"ahead" | "on-track" | "behind">("on-track");
  const [achievement, setAchievement] = useState<any>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Fetch analytics
      const analyticsResponse = await fetch(
        `/api/analytics?period=week&userId=${session.user.id}`
      );
      const analyticsData = await analyticsResponse.json();
      
      // Fetch today's tasks
      const today = format(new Date(), "yyyy-MM-dd");
      const tasksResponse = await fetch(`/api/tasks?date=${today}`);
      const tasksData = await tasksResponse.json();
      
      const totalTasks = tasksData.length || 5;
      const completedTasks = tasksData.filter((t: Task) => t.status === "COMPLETED").length;
      
      setDailyProgress({
        completedTasks,
        totalTasks,
        progressPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        checkInCount: analyticsData.metrics.checkInsCount || 0,
        averageRating: analyticsData.metrics.averageRating || 0,
        hoursLogged: analyticsData.metrics.hoursLogged || 0,
        currentStreak: analyticsData.user.streak || 0,
      });

      setUserData({
        level: analyticsData.user.level || 1,
        xp: analyticsData.user.xp || 0,
        streak: analyticsData.user.streak || 0,
      });

      // Find next priority task
      const incompleteTasks = tasksData.filter((t: Task) => t.status !== "COMPLETED");
      if (incompleteTasks.length > 0) {
        setNextTask(incompleteTasks[0]);
      }

      // Calculate workday remaining
      calculateWorkdayRemaining();

      // Determine pace status
      const currentHour = new Date().getHours();
      const workHoursElapsed = Math.max(0, currentHour - 9);
      const expectedTasks = Math.floor((workHoursElapsed / 8) * totalTasks);
      
      let newPaceStatus: "ahead" | "on-track" | "behind" = "on-track";
      if (completedTasks > expectedTasks + 1) {
        newPaceStatus = "ahead";
      } else if (completedTasks < expectedTasks - 1) {
        newPaceStatus = "behind";
      }
      setPaceStatus(newPaceStatus);

      generateMotivationalMessage(newPaceStatus);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const calculateWorkdayRemaining = () => {
    const now = new Date();
    const endOfWorkday = new Date();
    endOfWorkday.setHours(17, 0, 0, 0); // 5 PM

    const diffMs = endOfWorkday.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs <= 0) {
      setWorkdayRemaining("Workday Complete");
    } else {
      setWorkdayRemaining(`${diffHours}h ${diffMinutes}m remaining`);
    }
  };

  const generateMotivationalMessage = (
    paceStatus: string
  ) => {
    const messages = {
      ahead: [
        "You&apos;re crushing your goals! Keep this momentum going! 🔥",
        "Outstanding progress! You&apos;re absolutely dominating! 💪",
        "Wow! You&apos;re flying ahead of pace! Amazing work! 🚀",
      ],
      "on-track": [
        "Great work! You&apos;re right on pace! Keep it up! ✨",
        "You&apos;re doing amazing! Let&apos;s stay consistent! 🎯",
        "Fantastic! Keep this energy going! 💪",
      ],
      behind: [
        "You&apos;ve got this! Let&apos;s refocus and catch up! 🎯",
        "No worries! Consistency beats perfection. Keep going! 💪",
        "Time to shift into gear! You can turn this around! 🔥",
      ],
    };

    const msgArray =
      messages[paceStatus as keyof typeof messages] || messages["on-track"];
    const message = msgArray[Math.floor(Math.random() * msgArray.length)];
    setMotivationalMessage(message);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchDashboardData();
      
      // Update workday timer every minute
      const timer = setInterval(calculateWorkdayRemaining, 60000);
      return () => clearInterval(timer);
    }
  }, [status, router, fetchDashboardData]);

  const getPaceStatusColor = () => {
    switch (paceStatus) {
      case "ahead":
        return "text-green-600 bg-green-50 border-green-200";
      case "behind":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getPaceStatusIcon = () => {
    switch (paceStatus) {
      case "ahead":
        return "🚀";
      case "behind":
        return "⚠️";
      default:
        return "✅";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || "Productive One"}! 👋
          </h1>
          <p className="text-gray-600">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        {/* Motivational Message */}
        {motivationalMessage && (
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <CardContent>
              <p className="text-lg font-semibold text-white">{motivationalMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox
            label="Daily Progress"
            value={dailyProgress?.completedTasks || 0}
            unit={`/ ${dailyProgress?.totalTasks || 5}`}
            icon="📊"
            trend="up"
          />
          <StatBox
            label="Current Streak"
            value={dailyProgress?.currentStreak || 0}
            unit="days"
            icon="🔥"
            trend={(dailyProgress?.currentStreak ?? 0) > 0 ? "up" : "neutral"}
          />
          <StatBox
            label="Check-ins"
            value={dailyProgress?.checkInCount || 0}
            unit="today"
            icon="✅"
            trend="up"
          />
          <StatBox
            label="Avg Rating"
            value={dailyProgress?.averageRating || 0}
            unit="/10"
            icon="⭐"
            trend="up"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Task Progress */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Daily Task Progress" subtitle="You&apos;re doing great today!" />
              <CardContent>
                <ProgressBar
                  progress={dailyProgress?.progressPercentage || 0}
                  showLabel={true}
                />
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Hours Logged</span>
                    <span className="font-semibold text-gray-900">
                      {dailyProgress?.hoursLogged.toFixed(1)}h / 8h
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Productivity Rating</span>
                    <span className="font-semibold text-blue-600 text-lg">
                      {dailyProgress?.averageRating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowCheckIn(true)}
                >
                  ✅ Check-In Now
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  📝 New Task
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  📊 View Analytics
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  📔 Journal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Streak & Gamification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="🏆 Badges & Achievements" subtitle="Your accomplishments" />
            <CardContent>
              {badges.length > 0 ? (
                <BadgeDisplay badges={badges} compact={true} />
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Complete achievements to earn badges!</p>
                  <div className="mt-3 text-xs space-y-1">
                    <p>🔥 Complete 3-day streak</p>
                    <p>✅ Log your first check-in</p>
                    <p>📋 Complete your first task</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="💡 Tip of the Day" subtitle="Productivity wisdom" />
            <CardContent>
              <p className="text-gray-700 italic">
                &quot;Success is not final, failure is not fatal: it is the courage to continue that counts. Keep checking in hourly to maintain momentum!&quot;
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader title="⚡ Quick Actions" subtitle="Navigate to key features" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => router.push("/habits")}
                className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-green-900">Habits</div>
              </button>
              
              <button
                onClick={() => router.push("/weekly-review")}
                className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-semibold text-purple-900">Weekly Review</div>
              </button>
              
              <button
                onClick={() => router.push("/settings")}
                className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <div className="text-sm font-semibold text-gray-900">Settings</div>
              </button>
              
              <button
                onClick={() => setShowCheckIn(true)}
                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-3xl mb-2">📝</div>
                <div className="text-sm font-semibold text-blue-900">Check In</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Check-In Modal */}
        {showCheckIn && (
          <CheckInModal
            onClose={() => setShowCheckIn(false)}
            onSuccess={() => {
              setShowCheckIn(false);
              fetchDashboardData();
            }}
          />
        )}

        {/* Achievement Toast */}
        <AchievementToast
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      </div>
    </div>
  );
}
