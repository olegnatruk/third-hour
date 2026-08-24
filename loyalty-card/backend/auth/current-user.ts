import { createClient } from "@/lib/supabase/server";

export type AppRole = "customer" | "cashier" | "admin" | "owner";
export type AccountStatus = "active" | "suspended";

export class AuthenticationError extends Error {
  constructor() {
    super("You must be signed in to perform this action.");
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("You are not allowed to perform this action.");
  }
}

export class AccountSuspendedError extends Error {
  constructor() {
    super("This account is suspended.");
  }
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, status, display_name, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new AuthenticationError();
  }

  if (profile.status !== "active") {
    throw new AccountSuspendedError();
  }

  return {
    user,
    profile: {
      ...profile,
      role: profile.role as AppRole,
      status: profile.status as AccountStatus,
    },
  };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new AuthenticationError();
  }

  return currentUser;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const currentUser = await requireUser();

  if (!allowedRoles.includes(currentUser.profile.role)) {
    throw new AuthorizationError();
  }

  return currentUser;
}
