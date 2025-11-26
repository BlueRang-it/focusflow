import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
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

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("userId", user.id)
      .single();

    // If preferences don't exist, create default ones
    if (!preferences) {
      const { data: newPreferences, error } = await supabase
        .from("user_preferences")
        .insert({ userId: user.id })
        .select("*")
        .single();
      
      if (error) throw error;
      return NextResponse.json(newPreferences);
    }

    return NextResponse.json(preferences);
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

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updatePreferencesSchema.parse(body);

    // Check if preferences exist
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("userId", user.id)
      .single();

    let preferences;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("user_preferences")
        .update(validatedData)
        .eq("userId", user.id)
        .select("*")
        .single();
      if (error) throw error;
      preferences = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from("user_preferences")
        .insert({
          userId: user.id,
          ...validatedData,
        })
        .select("*")
        .single();
      if (error) throw error;
      preferences = data;
    }

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
