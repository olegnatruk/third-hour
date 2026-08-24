const EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmailAddress(email: string): string {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_ADDRESS.test(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  return normalized;
}
