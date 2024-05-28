import NextAuth from "next-auth";
import { authConfig } from "@/app/api/auth/auth.config"; // Corrected path

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
