import type { AppRole } from "@backend/auth/current-user";

export type AccountStatus = "active" | "suspended";

const ASSIGNABLE_ROLES: AppRole[] = ["customer", "cashier", "admin"];
const ACCOUNT_STATUSES: AccountStatus[] = ["active", "suspended"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class AccountValidationError extends Error {}

export function parseAccountId(accountId: string) {
  if (!UUID.test(accountId)) {
    throw new AccountValidationError("Invalid account identifier.");
  }

  return accountId;
}

export function parseAccountUpdate(input: unknown) {
  if (!input || typeof input !== "object") {
    throw new AccountValidationError("Invalid request body.");
  }

  const { role, status } = input as Record<string, unknown>;
  const update: { role?: AppRole; status?: AccountStatus } = {};

  if (role !== undefined) {
    if (typeof role !== "string" || !ASSIGNABLE_ROLES.includes(role as AppRole)) {
      throw new AccountValidationError("Invalid role.");
    }
    update.role = role as AppRole;
  }

  if (status !== undefined) {
    if (
      typeof status !== "string" ||
      !ACCOUNT_STATUSES.includes(status as AccountStatus)
    ) {
      throw new AccountValidationError("Invalid account status.");
    }
    update.status = status as AccountStatus;
  }

  if (Object.keys(update).length === 0) {
    throw new AccountValidationError("Provide a role or account status to update.");
  }

  return update;
}
