import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
// Lazy load PrismaAdapter to avoid build-time module resolution failures when not installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaAdapterFunc: any | undefined;
(async () => {
  try {
    const mod = await import("@auth/prisma-adapter");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PrismaAdapterFunc = (mod as any).PrismaAdapter;
  } catch {
    PrismaAdapterFunc = undefined;
  }
})();
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
    async authorize(credentials) {
        const validatedCredentials = credentialsSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

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
  adapter: PrismaAdapterFunc ? PrismaAdapterFunc(prisma) : undefined,
  providers,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      const protectedRoutes = ["/dashboard", "/tasks", "/journal", "/analytics"];
      const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      );

      if (isProtected) {
        return !!auth;
      }

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
