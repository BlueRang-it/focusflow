import NextAuth from "next-auth";
import { authConfig } from "./config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, auth, signIn, signOut } = (NextAuth as any)(authConfig);
