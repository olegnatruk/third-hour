"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { AdjustResult } from "@/lib/api/types";
import { Button, InfoNote, Input, Panel, Segmented } from "@/components/ui";

type Mode = "add" | "remove";

const MODES = [
  { value: "add", label: "Add one stamp" },
  { value: "remove", label: "Remove one stamp" },
] as const;

export function AdjustForm({
  customerId,
  name,
  cardNumber,
  currentCount,
}: {
  customerId: string;
  name: string;
  cardNumber: number | null;
  currentCount: number;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("add");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<AdjustResult | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (reason.trim().length === 0) {
      setError("A reason is required before you can submit.");
      return;
    }
    setPending(true);
    try {
      const { result } = await apiFetch<{ result: AdjustResult }>(
        "/api/stamps/adjust",
        {
          method: "POST",
          body: {
            customerId,
            stampChange: mode === "add" ? 1 : -1,
            reason: reason.trim(),
            idempotencyKey: crypto.randomUUID(),
          },
        },
      );
      setDone(result);
      setReason("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to adjust stamps.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-body text-success">
          Updated — new total {done.stampCount} / 10.
        </p>
        <Link
          href={`/admin/customers/${customerId}`}
          className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[var(--btn-primary)] px-6 text-[var(--btn-primary-fg)]"
        >
          Back to history
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Panel className="flex flex-col gap-1 p-4">
        <span className="text-body text-foreground">{name}</span>
        <span className="text-body-sm text-muted">
          {cardNumber ? `Card #${cardNumber} · ` : ""}currently {currentCount} / 10
        </span>
      </Panel>

      <Segmented
        options={MODES}
        value={mode}
        onChange={(m) => setMode(m as Mode)}
      />

      <Input
        label="Reason for this adjustment"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={error ?? undefined}
      />

      <InfoNote icon="lock">
        This change is logged with your name, the reason, and a timestamp.
      </InfoNote>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Submitting…" : "Submit adjustment"}
      </Button>
    </form>
  );
}
