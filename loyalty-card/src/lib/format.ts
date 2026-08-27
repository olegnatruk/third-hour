/** "Maria Cruz" -> "MC"; falls back to the first two letters of an email. */
export function initials(name: string | null | undefined, email?: string): string {
  const source = (name ?? "").trim();
  if (source) {
    const parts = source.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  }
  return (email ?? "?").slice(0, 2).toUpperCase();
}
