import { auth } from "@/auth";

/**
 * Throws if there is no authenticated admin session. Used by admin-only
 * server code (e.g. lib/admin-projects.ts) before touching the database.
 */
export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}
