"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressBar, StatBox } from "@/components/Progress";
import { CheckInModal } from "@/components/CheckInModal";
import BadgeDisplay from "@/components/BadgeDisplay";
import XPProgressBar from "@/components/XPProgressBar";
import AchievementToast from "@/components/AchievementToast";
import FocusTimer from "@/components/FocusTimer";
import ProductivityHeatmap from "@/components/ProductivityHeatmap";
import AIInsights from "@/components/AIInsights";
import { format, subDays } from "date-fns";

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

interface HeatmapData {
  date: string;
  count: number;
}

export default function EnhancedDashboard() {
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
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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

      // Generate heatmap data (last 90 days)
      const heatmap: HeatmapData[] = [];
      for (let i = 90; i >= 0; i--) {
        const date = subDays(new Date(), i);
        heatmap.push({
          date: format(date, "yyyy-MM-dd"),
          count: Math.floor(Math.random() * 10), // Replace with actual data
        });
      }
      setHeatmapData(heatmap);

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

  const generateMotivationalMessage = (paceStatus: string) => {
    const messages = {
      ahead: [
        "You're crushing your goals! Keep this momentum going! 🔥",
        "Outstanding progress! You're absolutely dominating! 💪",
        "Wow! You're flying ahead of pace! Amazing work! 🚀",
      ],
      "on-track": [
        "Great work! You're right on pace! Keep it up! ✨",
        "You're doing amazing! Let's stay consistent! 🎯",
        "Fantastic! Keep this energy going! 💪",
      ],
      behind: [
        "You've got this! Let's refocus and catch up! 🎯",
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
      
      // Update time every second
      const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
      
      // Update workday timer every minute
      const workdayTimer = setInterval(calculateWorkdayRemaining, 60000);
      
      return () => {
        clearInterval(timeTimer);
        clearInterval(workdayTimer);
      };
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your command center...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header with Real-time Clock */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Command Center
            </h1>
            <p className="text-gray-300 text-lg">Welcome back, {session.user?.name}! 👋</p>
            <p className="text-gray-400 text-sm mt-1">
              {format(currentTime, "EEEE, MMMM d, yyyy • h:mm:ss a")}
            </p>
          </div>
          
          {/* Workday Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">
                {workdayRemaining}
              </div>
              <div className="text-gray-300 text-sm">Until end of workday</div>
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        {motivationalMessage && (
          <Card className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl border-0">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="text-5xl">{getPaceStatusIcon()}</div>
              <div>
                <p className="text-xl font-semibold">{motivationalMessage}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Pace Status: <span className="font-semibold capitalize">{paceStatus}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Level & XP Progress - Prominent */}
        {userData && (
          <Card className="mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl">
            <CardContent className="py-6">
              <div className="flex items-center gap-6">
                <div className="text-7xl">⚡</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <span className="text-3xl font-bold">Level {userData.level}</span>
                    <span className="text-white/90 text-lg">{userData.xp} XP</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-6 mb-2">
                    <div
                      className="bg-white h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ width: `${((userData.xp % 1000) / 1000) * 100}%` }}
                    >
                      <span className="text-orange-600 text-xs font-bold">
                        {Math.floor(((userData.xp % 1000) / 1000) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm">
                    {1000 - (userData.xp % 1000)} XP to Level {userData.level + 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid - Glass morphism style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm mb-1">Tasks Today</div>
                <div className="text-4xl font-bold text-white">
                  {dailyProgress?.completedTasks || 0}
                  <span className="text-2xl text-gray-400">/{dailyProgress?.totalTasks || 5}</span>
                </div>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm mb-1">Current Streak</div>
                <div className="text-4xl font-bold text-white">
                  {dailyProgress?.currentStreak || 0}
                  <span className="text-xl text-gray-400"> days</span>
                </div>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm mb-1">Check-ins</div>
                <div className="text-4xl font-bold text-white">
                  {dailyProgress?.checkInCount || 0}
                  <span className="text-xl text-gray-400"> today</span>
                </div>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm mb-1">Productivity</div>
                <div className="text-4xl font-bold text-white">
                  {dailyProgress?.averageRating?.toFixed(1) || 0}
                  <span className="text-xl text-gray-400">/10</span>
                </div>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Focus Timer */}
          <div className="lg:col-span-1">
            <FocusTimer />
          </div>

          {/* Middle Column - Task Progress & Next Task */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader title="📈 Today's Progress" subtitle="Keep pushing forward!" />
              <CardContent>
                <ProgressBar
                  progress={dailyProgress?.progressPercentage || 0}
                  showLabel={true}
                />
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg backdrop-blur">
                    <span className="text-gray-200">Hours Logged</span>
                    <span className="font-semibold text-white text-lg">
                      {dailyProgress?.hoursLogged?.toFixed(1) || 0}h / 8h
                    </span>
                  </div>
                  {nextTask && (
                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur border border-white/20">
                      <div className="text-gray-300 text-sm mb-2">📌 Next Priority Task:</div>
                      <div className="text-white font-semibold">{nextTask.title}</div>
                      <Button
                        size="sm"
                        className="mt-3"
                        onClick={() => router.push("/tasks")}
                      >
                        View All Tasks →
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader title="⚡ Quick Actions" />
              <CardContent className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => setShowCheckIn(true)}
                >
                  ✅ Check-In Now
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full bg-white/10 hover:bg-white/20"
                  onClick={() => router.push("/tasks")}
                >
                  📝 New Task
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full bg-white/10 hover:bg-white/20"
                  onClick={() => router.push("/analytics")}
                >
                  📊 View Analytics
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full bg-white/10 hover:bg-white/20"
                  onClick={() => router.push("/journal")}
                >
                  📔 Journal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Secondary Grid - Heatmap & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProductivityHeatmap data={heatmapData} />
          <AIInsights userData={userData || undefined} dailyProgress={dailyProgress || undefined} />
        </div>

        {/* Badges Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader title="🏆 Achievements & Badges" subtitle="Your accomplishments" />
          <CardContent>
            {badges.length > 0 ? (
              <BadgeDisplay badges={badges} compact={false} />
            ) : (
              <div className="text-center py-8 text-gray-300">
                <p className="text-lg mb-3">Start earning badges by completing milestones!</p>
                <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-xs">3-Day Streak</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-xs">First Check-in</div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="text-xs">Complete Task</div>
                  </div>
                </div>
              </div>
            )}
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
