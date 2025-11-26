import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  description: z.string().optional(),
  category: z.string().default("Personal"),
  frequency: z.enum(["DAILY", "WEEKLY", "MULTIPLE_TIMES_DAILY"]).default("DAILY"),
  targetCount: z.number().int().positive().default(1),
  goalId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");

    let query = supabase
      .from("habits")
      .select(`
        *,
        goal:goals(*),
        logs:habit_logs(*)
      `)
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });
    
    if (isActive !== null) {
      query = query.eq("isActive", isActive === "true");
    }

    const { data: habits } = await query;
    
    // Sort logs for each habit
    const habitsWithSortedLogs = habits?.map(habit => ({
      ...habit,
      logs: habit.logs?.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 30) || []
    })) || [];

    return NextResponse.json(habitsWithSortedLogs);
  } catch (error) {
    console.error("Get habits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
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

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createHabitSchema.parse(body);

    const { data: habit, error: createError } = await supabase
      .from("habits")
      .insert({
        userId: user.id,
        ...validatedData,
      })
      .select(`
        *,
        goal:goals(*)
      `)
      .single();
    
    if (createError) throw createError;

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Create habit error:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
