import { NextResponse } from "next/server";
import { supabase } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id: taskId } = await context.params;

    const patchSchema = z.object({
      status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"]).optional(),
      timeSpent: z.number().int().nonnegative().optional(),
    });

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { status: newStatus, timeSpent } = parsed.data;

    // Verify ownership
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch task error:", fetchError);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!task || task.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Prepare update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (newStatus) updateData.status = newStatus;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (newStatus === "COMPLETED") updateData.completedAt = new Date().toISOString();

    const { data: updatedTask, error: updateError } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .select("*")
      .maybeSingle();

    if (updateError) {
      console.error("Supabase update task error:", updateError);
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await context.params;

    // Verify ownership
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch task error:", fetchError);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!task || task.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete task
    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId).select();

    if (deleteError) {
      console.error("Supabase delete task error:", deleteError);
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
