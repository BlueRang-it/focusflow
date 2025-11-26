"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import BackToTop from "@/components/BackToTop";
import HelpTooltip from "@/components/HelpTooltip";
import { format, subDays } from "date-fns";

interface AnalyticsData {
  metrics: {
    checkInsCount: number;
    averageRating: number;
    hoursLogged: number;
    tasksCompleted: number;
    habitsCompleted: number;
  };
  user: {
    level: number;
    xp: number;
    streak: number;
  };
  trends: {
    date: string;
    checkIns: number;
    rating: number;
  }[];
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.id) {
      fetchAnalytics();
    }
  }, [status, router, session, period]);

  const fetchAnalytics = async () => {
    if (!session?.user?.id) return;

    try {
      // Include userId in API call
      const response = await fetch(`/api/analytics?period=${period}&userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error("Analytics API error:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse" style={{animationDelay: '700ms'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">📊 Analytics</h1>
            <p className="text-gray-300 text-lg">Track your productivity and progress</p>
          </div>
          <HelpTooltip
            title="How to Use Analytics"
            content={[
              "Select time period: Week (7 days), Month (30 days), Year (365 days)",
              "Total Check-ins: Number of check-ins in selected period",
              "Average Rating: Your productivity score (1-10 scale)",
              "Hours Logged: Total time tracked on tasks",
              "Tasks/Habits Completed: Your output metrics",
              "Current Streak: Consecutive active days",
              "Level & XP: Progress to next level (1000 XP per level)",
              "Activity Trends: Daily check-ins and ratings over time"
            ]}
          />
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 capitalize ${
                period === p
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/50"
                  : "bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">✅</div>
              <div className="text-3xl font-bold">{analytics?.metrics.checkInsCount || 0}</div>
              <div className="text-blue-100">Total Check-ins</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-3xl font-bold">{analytics?.metrics.averageRating?.toFixed(1) || 0}</div>
              <div className="text-purple-100">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">⏱️</div>
              <div className="text-3xl font-bold">{analytics?.metrics.hoursLogged?.toFixed(1) || 0}h</div>
              <div className="text-green-100">Hours Logged</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">📋</div>
              <div className="text-3xl font-bold">{analytics?.metrics.tasksCompleted || 0}</div>
              <div className="text-orange-100">Tasks Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-3xl font-bold">{analytics?.metrics.habitsCompleted || 0}</div>
              <div className="text-pink-100">Habits Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent>
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-3xl font-bold">{analytics?.user.streak || 0}</div>
              <div className="text-yellow-100">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Level & XP */}
        <Card className="mb-8">
          <CardHeader title="🏆 Your Progress" />
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-6xl">⚡</div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">Level {analytics?.user.level || 1}</span>
                  <span className="text-gray-600">{analytics?.user.xp || 0} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                    style={{ width: `${((analytics?.user.xp || 0) % 1000) / 10}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {1000 - ((analytics?.user.xp || 0) % 1000)} XP to next level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Chart */}
        <Card>
          <CardHeader title="📈 Activity Trends" subtitle={`Last ${period}`} />
          <CardContent>
            <div className="space-y-4">
              {analytics?.trends && analytics.trends.length > 0 ? (
                analytics.trends.map((trend) => (
                  <div key={trend.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">
                      {format(new Date(trend.date), "MMM d")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-6">
                          <div
                            className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.min((trend.checkIns / 8) * 100, 100)}%` }}
                          >
                            <span className="text-white text-xs font-semibold">
                              {trend.checkIns}
                            </span>
                          </div>
                        </div>
                        <span className="text-yellow-500 text-sm font-semibold w-12">
                          ⭐ {trend.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No data available for this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <QuickAccessMenu />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </div>
  );
}
