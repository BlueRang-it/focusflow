import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { startOfWeek, endOfWeek, subDays } from "date-fns";

type CheckInLite = { productivityRating: number; createdAt: Date };
type TaskLite = { timeSpent: number | null; status: string };

const createWeeklyReviewSchema = z.object({
  weekStartDate: z.string().datetime(),
  weekEndDate: z.string().datetime(),
  whatWorkedWell: z.string().optional(),
  whatDidntWork: z.string().optional(),
  improvements: z.string().optional(),
  nextWeekPlan: z.string().optional(),
  priorities: z.string().optional(),
  focusAreas: z.string().optional(),
  overallSatisfaction: z.number().int().min(1).max(10).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const reviews = await prisma.weeklyReview.findMany({
      where: { userId: user.id },
      orderBy: { weekStartDate: "desc" },
      take: limit,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Get weekly reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createWeeklyReviewSchema.parse(body);

    const weekStart = new Date(validatedData.weekStartDate);
    const weekEnd = new Date(validatedData.weekEndDate);

    // Calculate metrics for the week
    const [completedTasks, checkIns] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId: user.id,
          status: "COMPLETED",
          completedAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      }),
      prisma.checkIn.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      }),
    ]);

    const averageProductivity =
      checkIns.length > 0
        ? checkIns.reduce((sum: number, ci: CheckInLite) => sum + ci.productivityRating, 0) /
          checkIns.length
        : 0;

    const totalHoursLogged =
      completedTasks.reduce((sum: number, task: TaskLite) => sum + (task.timeSpent || 0), 0) / 60;

    // Generate AI insights
    const insights = await generateWeeklyInsights(
      user,
      completedTasks.length,
      averageProductivity,
      totalHoursLogged,
      checkIns.length
    );

    const review = await prisma.weeklyReview.create({
      data: {
        userId: user.id,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        whatWorkedWell: validatedData.whatWorkedWell,
        whatDidntWork: validatedData.whatDidntWork,
        improvements: validatedData.improvements,
        nextWeekPlan: validatedData.nextWeekPlan,
        priorities: validatedData.priorities,
        focusAreas: validatedData.focusAreas,
        overallSatisfaction: validatedData.overallSatisfaction,
        tasksCompleted: completedTasks.length,
        averageProductivity,
        totalHoursLogged,
        generatedInsights: insights,
      },
    });

    // Award XP for completing weekly review
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 50 },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Create weekly review error:", error);
    return NextResponse.json(
      { error: "Failed to create weekly review" },
      { status: 500 }
    );
  }
}

// Helper function to generate insights
async function generateWeeklyInsights(
  user: { streak: number; level: number },
  tasksCompleted: number,
  averageProductivity: number,
  totalHours: number,
  checkIns: number
): Promise<string> {
  const insights: string[] = [];

  // Tasks analysis
  if (tasksCompleted >= 20) {
    insights.push("🎯 Outstanding week! You completed " + tasksCompleted + " tasks.");
  } else if (tasksCompleted >= 10) {
    insights.push("✅ Solid week with " + tasksCompleted + " tasks completed.");
  } else {
    insights.push("📊 " + tasksCompleted + " tasks completed. Consider breaking larger tasks into smaller chunks.");
  }

  // Productivity analysis
  if (averageProductivity >= 8) {
    insights.push("⭐ Excellent productivity rating of " + averageProductivity.toFixed(1) + "/10!");
  } else if (averageProductivity >= 6) {
    insights.push("💪 Good productivity at " + averageProductivity.toFixed(1) + "/10.");
  } else {
    insights.push("🔍 Productivity averaged " + averageProductivity.toFixed(1) + "/10. Look for patterns in your blockers.");
  }

  // Check-in consistency
  if (checkIns >= 35) {
    insights.push("🔥 Amazing consistency with " + checkIns + " check-ins this week!");
  } else if (checkIns >= 20) {
    insights.push("📝 Good check-in habit with " + checkIns + " entries.");
  } else {
    insights.push("⏰ Try to increase check-ins for better tracking (current: " + checkIns + ").");
  }

  // Hours logged
  if (totalHours >= 40) {
    insights.push("⏱️ Full work week logged: " + totalHours.toFixed(1) + " hours.");
  } else if (totalHours >= 20) {
    insights.push("🕐 " + totalHours.toFixed(1) + " hours logged this week.");
  }

  // Streak encouragement
  if (user.streak >= 7) {
    insights.push("🔥 Keep your " + user.streak + "-day streak alive!");
  }

  return insights.join("\n\n");
}
