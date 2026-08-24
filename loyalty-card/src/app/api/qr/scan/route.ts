import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  AuthorizationError,
  requireRole,
} from "@backend/auth/current-user";
import { QrTokenValidationError, verifyQrToken } from "@backend/qr/tokens";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof AccountSuspendedError || error instanceof AuthorizationError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (error instanceof QrTokenValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(
    { error: "QR code is invalid, expired, or has already been used." },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["cashier", "admin", "owner"]);
    const body = await request.json();

    if (!body || typeof body.token !== "string" || body.token.length > 2_000) {
      throw new QrTokenValidationError("QR code is invalid.");
    }

    const { tokenId } = verifyQrToken(body.token);
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.rpc(
      "consume_qr_token_and_award_stamp",
      {
        p_token_id: tokenId,
        p_actor_id: actor.user.id,
      },
    );

    if (error) {
      throw error;
    }

    return Response.json({ result: data });
  } catch (error) {
    return errorResponse(error);
  }
}
