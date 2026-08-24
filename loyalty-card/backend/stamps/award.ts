const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class StampAwardValidationError extends Error {}

export function parseStampAward(input: unknown) {
  if (!input || typeof input !== "object") {
    throw new StampAwardValidationError("Invalid request body.");
  }

  const { customerId, idempotencyKey } = input as Record<string, unknown>;

  if (typeof customerId !== "string" || !UUID.test(customerId)) {
    throw new StampAwardValidationError("Invalid customer identifier.");
  }

  if (typeof idempotencyKey !== "string" || !UUID.test(idempotencyKey)) {
    throw new StampAwardValidationError("Invalid scan identifier.");
  }

  return { customerId, idempotencyKey };
}
