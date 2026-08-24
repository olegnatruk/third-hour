import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import {
  parseStampAward,
  StampAwardValidationError,
} from "@backend/stamps/award";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (error instanceof StampAwardValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ error: "Unable to award stamp." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["cashier", "admin", "owner"]);
    const { customerId, idempotencyKey } = parseStampAward(await request.json());
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.rpc("award_stamp", {
      p_customer_id: customerId,
      p_actor_id: actor.user.id,
      p_idempotency_key: idempotencyKey,
    });

    if (error) {
      throw error;
    }

    return Response.json({ result: data });
  } catch (error) {
    return errorResponse(error);
  }
}
