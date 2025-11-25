import { NextResponse } from "next/server";
import { supabase } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  timeEstimate: z.number().optional(),
  dueDate: z.string().datetime().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    // Build Supabase query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("tasks").select("*").eq("userId", session.user.id);

    if (status) {
      q = q.eq("status", status);
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      q = q.gte("createdAt", start.toISOString()).lte("createdAt", end.toISOString());
    }

    // Apply ordering: priority asc, dueDate asc, createdAt desc
    q = q.order("priority", { ascending: true }).order("dueDate", { ascending: true }).order("createdAt", { ascending: false });

    const { data: tasks, error } = await q;
    if (error) {
      console.error("Supabase get tasks error:", error);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }

    return NextResponse.json(tasks ?? []);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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
    const { title, description, priority, timeEstimate, dueDate } =
      createTaskSchema.parse(body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      userId: session.user.id,
      title,
      description: description ?? null,
      priority,
      timeEstimate: timeEstimate ?? null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    const { data: createdTask, error: insertError } = await supabase
      .from("tasks")
      .insert(insertData)
      .select("*")
      .single();

    if (insertError) {
      console.error("Supabase create task error:", insertError);
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }

    return NextResponse.json(createdTask, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Validation error";
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
