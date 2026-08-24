export class RewardDefinitionValidationError extends Error {}

export function parseRewardDefinition(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new RewardDefinitionValidationError("A valid reward is required.");
  }

  const { name, description } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 120) {
    throw new RewardDefinitionValidationError(
      "Reward name must contain 1 to 120 characters.",
    );
  }

  if (description !== undefined && typeof description !== "string") {
    throw new RewardDefinitionValidationError("Reward description must be text.");
  }

  if (typeof description === "string" && description.trim().length > 500) {
    throw new RewardDefinitionValidationError(
      "Reward description must be 500 characters or fewer.",
    );
  }

  return {
    name: name.trim(),
    description: typeof description === "string" ? description.trim() || null : null,
  };
}
