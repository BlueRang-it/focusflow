import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { startOfDay } from "date-fns";

const logHabitSchema = z.object({
  date: z.string().datetime().optional(),
  count: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const { data: habit } = await supabase
      .from("habits")
      .select("*")
      .eq("id", id)
      .single();

    if (!habit || habit.userId !== user.id) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const body = await req.json();
    const { date, count, notes } = logHabitSchema.parse(body);

    const logDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());

    // Check if log exists for this date
    const { data: existingLog } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habitId", id)
      .eq("date", logDate.toISOString())
      .single();

    let habitLog;
    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from("habit_logs")
        .update({ count, notes })
        .eq("habitId", id)
        .eq("date", logDate.toISOString())
        .select("*")
        .single();
      if (error) throw error;
      habitLog = data;
    } else {
      // Create new log
      const { data, error } = await supabase
        .from("habit_logs")
        .insert({
          habitId: id,
          date: logDate.toISOString(),
          count,
          notes,
        })
        .select("*")
        .single();
      if (error) throw error;
      habitLog = data;
    }

    // Update habit statistics
    const { data: allLogs } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habitId", id)
      .order("date", { ascending: false });
    
    if (!allLogs) throw new Error("Failed to fetch habit logs");

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedLogs = allLogs.sort((a: { date: Date | string }, b: { date: Date | string }) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = startOfDay(new Date());
    let checkDate = today;

    // Calculate current streak (consecutive days from today backwards)
    for (const log of sortedLogs) {
      const logDate = startOfDay(new Date(log.date));
      const daysDiff = Math.floor(
        (checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0 || daysDiff === 1) {
        currentStreak++;
        checkDate = logDate;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedLogs.length; i++) {
      const currentDate = startOfDay(new Date(sortedLogs[i].date));
      const nextDate = i < sortedLogs.length - 1 
        ? startOfDay(new Date(sortedLogs[i + 1].date))
        : null;

      tempStreak++;

      if (nextDate) {
        const daysDiff = Math.floor(
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    const totalCompleted = allLogs.reduce((sum: number, log: { count: number }) => sum + log.count, 0);
    
    await supabase
      .from("habits")
      .update({
        currentStreak,
        longestStreak,
        totalCompleted,
      })
      .eq("id", id);

    // Award XP to user
    await supabase
      .from("users")
      .update({
        xp: (user.xp || 0) + 5,
      })
      .eq("id", user.id);

    return NextResponse.json(habitLog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Log habit error:", error);
    return NextResponse.json(
      { error: "Failed to log habit" },
      { status: 500 }
    );
  }
}
