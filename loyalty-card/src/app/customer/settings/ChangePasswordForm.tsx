"use client";

import { type FormEvent, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api/client";
import { Button, Input } from "@/components/ui";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: { password },
      });
      setPassword("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to change your password.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && (
        <p role="alert" className="text-body-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      {done && (
        <p className="text-body-sm text-success">Your password has been updated.</p>
      )}

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
