import { NextResponse } from "next/server";
import { supabase } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check user error:", checkError);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data: createdUser, error: insertError } = await supabase
      .from("users")
      .insert({ email, name, password: hashedPassword })
      .select("id, email, name")
      .single();

    if (insertError || !createdUser) {
      console.error("Supabase create user error:", insertError);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // Create initial analytics and preferences (best-effort)
    const analyticsPromise = supabase.from("analytics").insert({ userId: createdUser.id });
    const prefsPromise = supabase.from("user_preferences").insert({ userId: createdUser.id });
    const [aRes, pRes] = await Promise.all([analyticsPromise, prefsPromise]);

    if (aRes.error) console.warn("Failed to create analytics row:", aRes.error);
    if (pRes.error) console.warn("Failed to create preferences row:", pRes.error);

    return NextResponse.json(
      {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
