"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar, StatBox } from "@/components/Progress";
import { CheckInModal } from "@/components/CheckInModal";
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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  const fetchDashboardData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/analytics?period=week&userId=${session.user.id}`
      );
      const data = await response.json();
      setDailyProgress({
        completedTasks: data.metrics.tasksCompleted || 0,
        totalTasks: 5, // Default estimate
        progressPercentage: (data.metrics.tasksCompleted / 5) * 100,
        checkInCount: data.metrics.checkInsCount || 0,
        averageRating: data.metrics.averageRating || 0,
        hoursLogged: data.metrics.hoursLogged || 0,
        currentStreak: data.user.streak || 0,
      });

      // Generate motivational message based on pace
      const paceStatus =
        data.metrics.tasksCompleted > 3 ? "ahead" : "on-track";
      generateMotivationalMessage(paceStatus);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

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
    }
  }, [status, router, fetchDashboardData]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
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
          <Card className="mb-6 bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <CardContent>
              <p className="text-lg font-semibold">{motivationalMessage}</p>
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
            trend={dailyProgress?.currentStreak ?? 0 > 0 ? "up" : "neutral"}
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
            <CardHeader title="🏆 Achievements" subtitle="Keep the streak alive!" />
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <span>🔥 3-Day Streak</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-200 rounded-full">
                    Unlocked
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                  <span>⭐ 7-Day Streak</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">
                    {Math.max(0, 7 - (dailyProgress?.currentStreak || 0))} days away
                  </span>
                </div>
              </div>
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
      </div>
    </div>
  );
}
