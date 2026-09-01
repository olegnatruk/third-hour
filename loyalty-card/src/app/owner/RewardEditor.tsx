"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import { Button, Input, SheetOverlay } from "@/components/ui";

export function RewardEditor({
  initialName,
  initialDescription,
  onClose,
}: {
  initialName: string;
  initialDescription: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (name.trim().length === 0 || name.trim().length > 120) {
      setError("Reward name must be 1–120 characters.");
      return;
    }
    setPending(true);
    try {
      await apiFetch("/api/admin/rewards", {
        method: "POST",
        body: { name: name.trim(), description: description.trim() || undefined },
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update the reward.",
      );
      setPending(false);
    }
  }

  return (
    <SheetOverlay title="Edit Reward" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Reward name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-body-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Saving…" : "Save reward"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
      </form>
    </SheetOverlay>
  );
}
