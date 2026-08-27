import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/error";
import { serverFetch } from "@/lib/api/server";
import type { AppRole, SessionUser } from "@/lib/api/types";
import { homePathForRole } from "./roles";

export { homePathForRole };

/** Current user, or null when unauthenticated / suspended. */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { user } = await serverFetch<{ user: SessionUser }>("/api/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

/** Require a signed-in user; redirect to /sign-in otherwise. */
export async function requirePageUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  return user;
}

/**
 * Require one of `roles`. Redirects unauthenticated users to /sign-in and
 * wrong-role users to their own area. Page guards are defense-in-depth —
 * every API route also enforces role server-side.
 */
export async function requirePageRole(roles: AppRole[]): Promise<SessionUser> {
  const user = await requirePageUser();
  if (!roles.includes(user.role)) {
    redirect(homePathForRole(user.role));
  }
  return user;
}
