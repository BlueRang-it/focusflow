import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { startOfDay } from "date-fns";

const logHabitSchema = z.object({
  date: z.string().datetime().optional(),
  count: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const habit = await prisma.habit.findUnique({
      where: { id: params.id },
    });

    if (!habit || habit.userId !== user.id) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const body = await req.json();
    const { date, count, notes } = logHabitSchema.parse(body);

    const logDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());

    // Upsert habit log (update if exists for same date, create if not)
    const habitLog = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: params.id,
          date: logDate,
        },
      },
      update: {
        count,
        notes,
      },
      create: {
        habitId: params.id,
        date: logDate,
        count,
        notes,
      },
    });

    // Update habit statistics
    const allLogs = await prisma.habitLog.findMany({
      where: { habitId: params.id },
      orderBy: { date: "desc" },
    });

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedLogs = allLogs.sort((a, b) => 
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

    await prisma.habit.update({
      where: { id: params.id },
      data: {
        currentStreak,
        longestStreak,
        totalCompleted: allLogs.reduce((sum, log) => sum + log.count, 0),
      },
    });

    // Award XP to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 5 },
      },
    });

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
