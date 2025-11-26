import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

const createJournalSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  mood: z.enum(["VERY_UNHAPPY", "UNHAPPY", "NEUTRAL", "HAPPY", "VERY_HAPPY"]).optional(),
  productivity: z.number().int().min(1).max(10).optional(),
  reflectionNotes: z.string().optional(),
  lessonsLearned: z.string().optional(),
  tomorrowPlan: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const mood = searchParams.get("mood");
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build Supabase query with filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from("journal_entries")
      .select("*")
      .eq("userId", session.user.id);

    if (search) {
      // case-insensitive substring match
      q = q.ilike("content", `%${search}%`);
    }

    if (mood) {
      q = q.eq("mood", mood);
    }

    q = q.order("createdAt", { ascending: false });

    const start = offset;
    const end = offset + limit - 1;

    const { data: entries, error: fetchError } = await q.range(start, end);

    if (fetchError) {
      console.error("Supabase get journal entries error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 });
    }

    // Get total count separately (head request)
    const { count, error: countError } = await supabase
      .from("journal_entries")
      .select("*", { head: true, count: "exact" })
      .eq("userId", session.user.id)
      .maybeSingle();

    let total = 0;
    if (countError) {
      console.warn("Failed to fetch journal total count:", countError);
    } else if (typeof count === "number") {
      total = count;
    } else if (Array.isArray(entries)) {
      // Fallback: use length when count not available
      total = entries.length;
    }

    return NextResponse.json({
      entries: entries ?? [],
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Get journal entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
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
      title,
      content,
      mood,
      productivity,
      reflectionNotes,
      lessonsLearned,
      tomorrowPlan,
    } = createJournalSchema.parse(body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      userId: session.user.id,
      title: title ?? null,
      content,
      mood: mood ?? null,
      productivity: productivity ?? null,
      reflectionNotes: reflectionNotes ?? null,
      lessonsLearned: lessonsLearned ?? null,
      tomorrowPlan: tomorrowPlan ?? null,
    };

    const { data: createdEntry, error: insertError } = await supabase
      .from("journal_entries")
      .insert(insertData)
      .select("*")
      .single();

    if (insertError) {
      console.error("Supabase create journal entry error:", insertError);
      return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 });
    }

    return NextResponse.json(createdEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Validation error";
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    console.error("Create journal entry error:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
