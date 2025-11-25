import { NextResponse } from "next/server";
import { supabase } from "@/lib/prisma";
import { auth } from "@/auth";
import { subDays } from "date-fns";

type CheckInLite = { productivityRating: number; createdAt: Date; mood: string };
type TaskLite = { timeSpent?: number };

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "week"; // week, month, all

    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("name, level, xp, streak, longestStreak")
      .eq("id", session.user.id)
      .maybeSingle();

    if (userErr) {
      console.warn("Failed to fetch user for analytics:", userErr);
    }

    const { data: analytics, error: analyticsErr } = await supabase
      .from("analytics")
      .select("*")
      .eq("userId", session.user.id)
      .maybeSingle();

    if (analyticsErr) {
      console.warn("Failed to fetch analytics row:", analyticsErr);
    }

    if (!analytics) {
      return NextResponse.json({
        user: {
          name: user?.name,
          level: user?.level,
          xp: user?.xp,
          streak: user?.streak,
          longestStreak: user?.longestStreak,
        },
        period,
        metrics: {
          checkInsCount: 0,
          tasksCompleted: 0,
          averageRating: 0,
          peakHour: undefined,
          hoursLogged: 0,
        },
        analytics: null,
        dailyStats: [],
        topMoods: {},
      });
    }

    // Get date range
    const now = new Date();
    const rangeStart =
      period === "week"
        ? subDays(now, 7)
        : period === "month"
          ? subDays(now, 30)
          : subDays(now, 365);

    // Fetch check-ins and tasks for period
    const { data: checkInsRaw, error: checkInsErr } = await supabase
      .from("check_ins")
      .select("*")
      .eq("userId", session.user.id)
      .gte("createdAt", rangeStart.toISOString());

    if (checkInsErr) console.warn("Failed to fetch check-ins:", checkInsErr);

    const { data: completedTasks, error: tasksErr } = await supabase
      .from("tasks")
      .select("*")
      .eq("userId", session.user.id)
      .eq("status", "COMPLETED")
      .gte("completedAt", rangeStart.toISOString());

    if (tasksErr) console.warn("Failed to fetch completed tasks:", tasksErr);

    const checkIns = checkInsRaw ?? [];

    // Calculate metrics
    // Normalize check-in createdAt to Date and compute avg
    const normalizedCheckIns = (checkIns as Array<CheckInLite & { createdAt: string }>).map((ci) => ({
      ...ci,
      createdAt: new Date(ci.createdAt),
    }));

    const avgRating =
      normalizedCheckIns.length > 0
        ? normalizedCheckIns.reduce((sum: number, ci: CheckInLite) => sum + ci.productivityRating, 0) /
          normalizedCheckIns.length
        : 0;

    const hourlyBreakdown: Record<number, number[]> = {};
    normalizedCheckIns.forEach((ci: CheckInLite) => {
      const hour = (ci.createdAt as Date).getHours();
      if (!hourlyBreakdown[hour]) hourlyBreakdown[hour] = [];
      hourlyBreakdown[hour].push(ci.productivityRating);
    });

    const peakHour = Object.entries(hourlyBreakdown).sort(
      (a: [string, number[]], b: [string, number[]]) =>
        b[1].reduce((sum: number, r: number) => sum + r, 0) / b[1].length -
        a[1].reduce((sum: number, r: number) => sum + r, 0) / a[1].length
    )[0]?.[0];

    // Daily statistics
    const take = period === "week" ? 7 : period === "month" ? 30 : 365;
    const { data: dailyStats, error: dailyErr } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("analyticsId", analytics?.id)
      .order("date", { ascending: false })
      .limit(take);

    if (dailyErr) console.warn("Failed to fetch dailyStats:", dailyErr);

    return NextResponse.json({
      user: {
        name: user?.name,
        level: user?.level,
        xp: user?.xp,
        streak: user?.streak,
        longestStreak: user?.longestStreak,
      },
      period,
      metrics: {
        checkInsCount: (checkIns ?? []).length,
        tasksCompleted: (completedTasks ?? []).length,
        averageRating: Math.round(avgRating * 10) / 10,
        peakHour,
        hoursLogged: (completedTasks ?? []).reduce((sum: number, t: TaskLite) => sum + (t.timeSpent || 0), 0) / 60,
      },
      analytics,
      dailyStats: dailyStats ?? [],
      topMoods: getMoodDistribution(normalizedCheckIns),
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

function getMoodDistribution(
  checkIns: Array<{ mood: string; productivityRating: number }>
) {
  const moodCount: Record<string, number> = {};
  checkIns.forEach((ci) => {
    moodCount[ci.mood] = (moodCount[ci.mood] || 0) + 1;
  });
  return moodCount;
}
