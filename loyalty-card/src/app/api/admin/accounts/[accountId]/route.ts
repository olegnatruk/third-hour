import {
  AccountValidationError,
  parseAccountId,
  parseAccountUpdate,
} from "@backend/auth/accounts";
import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (error instanceof AccountValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ error: "Unable to update account." }, { status: 500 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  try {
    const currentUser = await requireRole(["owner"]);
    const accountId = parseAccountId((await params).accountId);

    if (accountId === currentUser.user.id) {
      throw new AccountValidationError("Owners cannot change their own access.");
    }

    const update = parseAccountUpdate(await request.json());
    const adminClient = createAdminClient();
    const { data: target, error: targetError } = await adminClient
      .from("profiles")
      .select("id, role")
      .eq("id", accountId)
      .single();

    if (targetError || !target) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }

    if (target.role === "owner") {
      throw new AccountValidationError("Owner accounts cannot be changed through this endpoint.");
    }

    const { data, error } = await adminClient
      .from("profiles")
      .update(update)
      .eq("id", accountId)
      .select("id, email, display_name, role, status, created_at, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ account: data });
  } catch (error) {
    return errorResponse(error);
  }
}
