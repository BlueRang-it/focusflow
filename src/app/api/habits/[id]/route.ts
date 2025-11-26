import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MULTIPLE_TIMES_DAILY"]).optional(),
  targetCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  goalId: z.string().optional(),
});

export async function PATCH(
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
    const validatedData = updateHabitSchema.parse(body);

    const { data: updatedHabit, error: updateError } = await supabase
      .from("habits")
      .update(validatedData)
      .eq("id", id)
      .select(`
        *,
        goal:goals(*),
        logs:habit_logs(*)
      `)
      .single();

    if (updateError) throw updateError;

    // Sort and limit logs
    const habitWithSortedLogs = {
      ...updatedHabit,
      logs: updatedHabit.logs?.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 30) || []
    };

    return NextResponse.json(habitWithSortedLogs);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Update habit error:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete habit error:", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}
