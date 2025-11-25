import type { Adapter } from "next-auth/adapters";

declare module "@auth/prisma-adapter" {
  function PrismaAdapter(prisma: unknown): Adapter;
  export { PrismaAdapter };
  export default PrismaAdapter;
}
