import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
// No Prisma adapter used in Supabase-only setup
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const validatedCredentials = credentialsSchema.safeParse(credentials);

      if (!validatedCredentials.success) {
        console.log("❌ Credentials validation failed");
        return null;
      }

      const { email, password } = validatedCredentials.data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        console.log("❌ User not found or no password:", email);
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log("❌ Password mismatch for:", email);
        return null;
      }

      console.log("✅ Login successful for:", email);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.profileImage,
      };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const authConfig = {
  providers,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      const protectedRoutes = ["/dashboard", "/tasks", "/journal", "/analytics", "/habits", "/settings", "/weekly-review"];
      const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      );

      if (isProtected) {
        return !!auth;
      }

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  trustHost: true,
};
