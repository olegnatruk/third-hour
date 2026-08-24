import { randomUUID } from "node:crypto";
import { createAdminClient } from "@backend/auth/admin-client";
import {
  AccountSuspendedError,
  AuthenticationError,
  requireUser,
} from "@backend/auth/current-user";
import { issueQrToken } from "@backend/qr/tokens";

export const runtime = "nodejs";

const TOKEN_LIFETIME_MS = 60_000;

export async function POST() {
  try {
    const currentUser = await requireUser();
    const tokenId = randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS);
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("qr_scan_tokens").insert({
      id: tokenId,
      customer_id: currentUser.user.id,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      throw error;
    }

    return Response.json({
      token: issueQrToken(tokenId, expiresAt),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof AccountSuspendedError) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ error: "Unable to create QR code." }, { status: 500 });
  }
}
