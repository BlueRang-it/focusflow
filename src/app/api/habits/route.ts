import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        ...(isActive !== null && { isActive: isActive === "true" }),
      },
      include: {
        goal: true,
        logs: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(habits);
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createHabitSchema.parse(body);

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        ...validatedData,
      },
      include: {
        goal: true,
      },
    });

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
