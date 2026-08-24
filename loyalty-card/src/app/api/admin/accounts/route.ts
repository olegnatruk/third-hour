import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import { createClient } from "@/lib/supabase/server";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ error: "Unable to load accounts." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    await requireRole(["admin", "owner"]);
    const requestedLimit = Number(new URL(request.url).searchParams.get("limit") ?? 50);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 50;
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("profiles")
      .select("id, email, display_name, role, status, created_at, updated_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(0, limit - 1);

    if (error) {
      throw error;
    }

    return Response.json({ accounts: data, total: count ?? 0 });
  } catch (error) {
    return errorResponse(error);
  }
}
