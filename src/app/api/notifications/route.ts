import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const createNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum([
    "CHECK_IN_REMINDER",
    "TASK_DUE",
    "FELL_BEHIND",
    "MOTIVATIONAL",
    "ACHIEVEMENT",
    "STREAK_MILESTONE",
    "DAILY_SUMMARY",
    "INACTIVITY_ALERT",
    "CUSTOM",
  ]),
  actionUrl: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
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
    const isRead = searchParams.get("isRead");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (isRead !== null) {
      query = query.eq("isRead", isRead === "true");
    }

    const { data: notifications } = await query;

    return NextResponse.json(notifications || []);
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
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
    const validatedData = createNotificationSchema.parse(body);

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        userId: user.id,
        ...validatedData,
        expiresAt: validatedData.expiresAt
          ? new Date(validatedData.expiresAt).toISOString()
          : null,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Create notification error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
