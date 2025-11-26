import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

const createCheckInSchema = z.object({
  accomplishment: z.string().min(1),
  productivityRating: z.number().int().min(1).max(10),
  mood: z.enum(["VERY_UNHAPPY", "UNHAPPY", "NEUTRAL", "HAPPY", "VERY_HAPPY"]),
  blockers: z.string().optional(),
  distractions: z.string().optional(),
  notes: z.string().optional(),
  taskId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: checkIns, error } = await supabase
      .from("check_ins")
      .select("*, task:tasks(*)")
      .eq("userId", session.user.id)
      .gte("createdAt", startDate.toISOString())
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase get check-ins error:", error);
      return NextResponse.json({ error: "Failed to fetch check-ins" }, { status: 500 });
    }

    return NextResponse.json(checkIns ?? []);
  } catch (error) {
    console.error("Get check-ins error:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      accomplishment,
      productivityRating,
      mood,
      blockers,
      distractions,
      notes,
      taskId,
    } = createCheckInSchema.parse(body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      userId: session.user.id,
      accomplishment,
      productivityRating,
      mood,
      blockers: blockers ?? null,
      distractions: distractions ?? null,
      notes: notes ?? null,
      taskId: taskId ?? null,
    };

    const { data: checkIn, error: insertError } = await supabase
      .from("check_ins")
      .insert(insertData)
      .select("*, task:tasks(*)")
      .single();

    if (insertError) {
      console.error("Supabase create check-in error:", insertError);
      return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 });
    }

    // Update user totals (best-effort): fetch current values, then update
    const { data: userRow, error: userFetchError } = await supabase
      .from("users")
      .select("totalCheckIns, xp")
      .eq("id", session.user.id)
      .maybeSingle();

    if (userFetchError) {
      console.warn("Failed to fetch user for totals update:", userFetchError);
    } else if (userRow) {
      const newTotals = {
        totalCheckIns: (userRow.totalCheckIns || 0) + 1,
        xp: (userRow.xp || 0) + 10,
      };

      const { error: updateErr } = await supabase
        .from("users")
        .update(newTotals)
        .eq("id", session.user.id);

      if (updateErr) console.warn("Failed to update user totals:", updateErr);
    }

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Validation error";
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    console.error("Create check-in error:", error);
    return NextResponse.json(
      { error: "Failed to create check-in" },
      { status: 500 }
    );
  }
}
