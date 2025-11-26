import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

type CheckInLite = { productivityRating: number; createdAt: Date };
type TaskLite = { status: string; priority: string; title?: string; timeEstimate?: number };
type MoodEntryLite = { stress?: number };

const AICoachSchema = z.object({
  sessionType: z.enum([
    "BEHAVIOR_ANALYSIS",
    "PROCRASTINATION_PREDICTION",
    "TASK_RECOMMENDATION",
    "DAILY_BRIEF",
    "WEEKLY_SUMMARY",
    "BURNOUT_DETECTION",
    "MOTIVATION_BOOST",
    "PATTERN_IDENTIFICATION",
    "PLANNING_ASSISTANCE",
    "REFLECTION",
  ]),
  context: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { data: sessions } = await supabase
      .from("ai_coach_sessions")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .limit(10);

    return Response.json(sessions || []);
  } catch (error) {
    console.error("AI Coach GET error:", error);
    return Response.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { sessionType, context } = AICoachSchema.parse(body);

    const [checkInsRes, tasksRes, moodRes] = await Promise.all([
      supabase
        .from("check_ins")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })
        .limit(30),
      supabase
        .from("tasks")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false })
        .limit(20),
      supabase
        .from("mood_entries")
        .select("*")
        .eq("userId", user.id)
        .order("recordedAt", { ascending: false })
        .limit(14),
    ]);

    const recentCheckIns = checkInsRes.data || [];
    const recentTasks = tasksRes.data || [];
    const moodEntries = moodRes.data || [];

    let analysis = "";
    let prediction = "";
    let recommendation = "";
    let motivationalMessage = "";

    if (sessionType === "BEHAVIOR_ANALYSIS") {
      const avgRating =
        recentCheckIns.length > 0
          ? recentCheckIns.reduce(
              (sum: number, ci: CheckInLite) => sum + (ci.productivityRating || 0),
              0
            ) / recentCheckIns.length
          : 0;

      analysis = `Based on your last 30 check-ins, your average productivity rating is ${avgRating.toFixed(1)}/10. Your focus patterns suggest ${
        avgRating > 7 ? "strong discipline" : "room for improvement"
      }.`;
    } else if (sessionType === "PROCRASTINATION_PREDICTION") {
      const incompleteTasks = recentTasks.filter(
        (t: TaskLite) => t.status !== "COMPLETED"
      ).length;
      prediction =
        incompleteTasks > 5
          ? "You have a high number of incomplete tasks. There's a 75% chance you might procrastinate without proper time-blocking."
          : "Your task completion rate is healthy. Low procrastination risk detected.";
    } else if (sessionType === "TASK_RECOMMENDATION") {
      const highPriorityTasks = recentTasks.filter(
        (t: TaskLite) => t.priority === "HIGH" || t.priority === "URGENT"
      );
      recommendation =
        highPriorityTasks.length > 0
          ? `Focus on: ${highPriorityTasks[0]?.title}. Estimated time: ${
              highPriorityTasks[0]?.timeEstimate || 30
            } minutes.`
          : "All tasks are properly prioritized.";
    } else if (sessionType === "MOTIVATION_BOOST") {
      motivationalMessage = `You've been on a ${user.streak}-day streak! 🔥 Your consistency is your superpower!`;
    } else if (sessionType === "BURNOUT_DETECTION") {
      const recentMood = moodEntries.slice(0, 7);
      const avgStress =
        recentMood.length > 0
          ? recentMood.reduce((sum: number, m: MoodEntryLite) => sum + (m.stress || 0), 0) /
            recentMood.length
          : 0;
      analysis =
        avgStress > 7
          ? "⚠️ Burnout warning: High stress levels detected. Consider taking a break."
          : "Your stress levels are healthy. Keep up the balance!";
    }

    const { data: aiSession, error } = await supabase
      .from("ai_coach_sessions")
      .insert({
        userId: user.id,
        sessionType,
        context,
        analysis,
        prediction,
        recommendation,
        motivationalMessage,
      })
      .select("*")
      .single();

    if (error) throw error;

    return Response.json(aiSession, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    console.error("AI Coach POST error:", error);
    return Response.json({ error: "Failed to create session" }, { status: 500 });
  }
}

