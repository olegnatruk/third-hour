import { normalizeEmailAddress } from "@backend/auth/email";

export type AuthCredentials = {
  email: string;
  password: string;
  displayName?: string;
};

export class CredentialsValidationError extends Error {}

export function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    throw new CredentialsValidationError("Password is required.");
  }

  if (password.length < 8 || password.length > 72) {
    throw new CredentialsValidationError("Password must be between 8 and 72 characters.");
  }

  return password;
}

export function parseCredentials(input: unknown, allowDisplayName = false): AuthCredentials {
  if (!input || typeof input !== "object") {
    throw new CredentialsValidationError("Invalid request body.");
  }

  const { email, password, displayName } = input as Record<string, unknown>;

  if (typeof email !== "string") {
    throw new CredentialsValidationError("Email address and password are required.");
  }
  const validatedPassword = validatePassword(password);

  if (!allowDisplayName) {
    return { email: normalizeEmailAddress(email), password: validatedPassword };
  }

  if (typeof displayName !== "string" || displayName.trim().length === 0) {
    throw new CredentialsValidationError("Display name is required.");
  }

  const normalizedDisplayName = displayName.trim();

  if (normalizedDisplayName.length > 80) {
    throw new CredentialsValidationError("Display name must be 80 characters or fewer.");
  }

  return {
    email: normalizeEmailAddress(email),
    password: validatedPassword,
    displayName: normalizedDisplayName,
  };
}
