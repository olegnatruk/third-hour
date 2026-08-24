const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class StampAdjustmentValidationError extends Error {}

export function parseStampAdjustment(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new StampAdjustmentValidationError("A valid adjustment is required.");
  }

  const { customerId, stampChange, reason, idempotencyKey } = body as Record<
    string,
    unknown
  >;

  if (typeof customerId !== "string" || !UUID.test(customerId)) {
    throw new StampAdjustmentValidationError("A valid customer ID is required.");
  }

  if (stampChange !== -1 && stampChange !== 1) {
    throw new StampAdjustmentValidationError("Stamp change must be either -1 or 1.");
  }

  if (
    typeof reason !== "string" ||
    reason.trim().length === 0 ||
    reason.trim().length > 500
  ) {
    throw new StampAdjustmentValidationError(
      "A reason between 1 and 500 characters is required.",
    );
  }

  if (typeof idempotencyKey !== "string" || !UUID.test(idempotencyKey)) {
    throw new StampAdjustmentValidationError("A valid idempotency key is required.");
  }

  return { customerId, stampChange, reason: reason.trim(), idempotencyKey };
}
