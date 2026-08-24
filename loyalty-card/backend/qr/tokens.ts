import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_PARTS = 2;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type QrTokenPayload = {
  expiresAt: number;
  tokenId: string;
};

export class QrTokenValidationError extends Error {}

function signingSecret() {
  const secret = process.env.QR_SIGNING_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("QR signing is not configured.");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

export function issueQrToken(tokenId: string, expiresAt: Date) {
  const payload = Buffer.from(
    JSON.stringify({ tokenId, expiresAt: expiresAt.getTime() } satisfies QrTokenPayload),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyQrToken(token: string): QrTokenPayload {
  const parts = token.split(".");

  if (parts.length !== TOKEN_PARTS || !parts[0] || !parts[1]) {
    throw new QrTokenValidationError("QR code is invalid.");
  }

  const [payload, signature] = parts;
  const expectedSignature = sign(payload);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new QrTokenValidationError("QR code is invalid.");
  }

  let decoded: QrTokenPayload;

  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new QrTokenValidationError("QR code is invalid.");
  }

  if (
    !UUID.test(decoded.tokenId) ||
    !Number.isSafeInteger(decoded.expiresAt) ||
    decoded.expiresAt <= Date.now()
  ) {
    throw new QrTokenValidationError("QR code is invalid or expired.");
  }

  return decoded;
}
