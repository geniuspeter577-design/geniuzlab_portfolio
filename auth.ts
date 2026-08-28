import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const password = parsed.data.password;

        if (email !== env.ADMIN_EMAIL.toLowerCase()) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (existingUser) {
          const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.email,
          };
        }

        if (!env.ADMIN_PASSWORD_HASH) {
          return null;
        }

        const isDefaultAdminValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
        if (!isDefaultAdminValid) {
          return null;
        }

        return {
          id: "admin",
          email,
          name: "GENIUZLAB Admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub ?? token.id) as string;
      }

      return session;
    },
  },
});
