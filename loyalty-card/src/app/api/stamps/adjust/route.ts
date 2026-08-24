import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import {
  parseStampAdjustment,
  StampAdjustmentValidationError,
} from "@backend/stamps/adjustments";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (error instanceof StampAdjustmentValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ error: "Unable to adjust stamps." }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["admin", "owner"]);
    const adjustment = parseStampAdjustment(await request.json());
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.rpc("adjust_active_card_stamp", {
      p_customer_id: adjustment.customerId,
      p_actor_id: actor.user.id,
      p_stamp_change: adjustment.stampChange,
      p_reason: adjustment.reason,
      p_idempotency_key: adjustment.idempotencyKey,
    });

    if (error) {
      throw error;
    }

    return Response.json({ result: data });
  } catch (error) {
    return errorResponse(error);
  }
}
