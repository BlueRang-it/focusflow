import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePreferencesSchema = z.object({
  enableEmailNotifications: z.boolean().optional(),
  enablePushNotifications: z.boolean().optional(),
  enableDailyDigest: z.boolean().optional(),
  enableMotivationalMessages: z.boolean().optional(),
  enableStreakAlerts: z.boolean().optional(),
  productivityStyle: z.enum(["focused", "balanced", "flexible"]).optional(),
  preferredWorkBlocks: z.number().int().positive().optional(),
  preferredBreakLength: z.number().int().positive().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If preferences don't exist, create default ones
    if (!user.preferences) {
      const preferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,
        },
      });
      return NextResponse.json(preferences);
    }

    return NextResponse.json(user.preferences);
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
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
    const validatedData = updatePreferencesSchema.parse(body);

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: validatedData,
      create: {
        userId: user.id,
        ...validatedData,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
