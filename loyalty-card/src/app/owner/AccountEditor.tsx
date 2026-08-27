"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { Account, AccountStatus, AppRole } from "@/lib/api/types";
import { Button, Segmented, Sheet } from "@/components/ui";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "cashier", label: "Cashier" },
  { value: "admin", label: "Admin" },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
] as const;

export function AccountEditor({
  account,
  onClose,
}: {
  account: Account;
  onClose: () => void;
}) {
  const router = useRouter();
  const [role, setRole] = useState<AppRole>(account.role);
  const [status, setStatus] = useState<AccountStatus>(account.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = role !== account.role || status !== account.status;

  async function save() {
    setPending(true);
    setError(null);
    try {
      const body: { role?: AppRole; status?: AccountStatus } = {};
      if (role !== account.role) body.role = role;
      if (status !== account.status) body.status = status;
      await apiFetch(`/api/admin/accounts/${account.id}`, {
        method: "PATCH",
        body,
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update this account.",
      );
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col justify-end bg-black/50">
      <button
        type="button"
        aria-label="Close"
        className="flex-1"
        onClick={onClose}
      />
      <Sheet title={account.display_name ?? account.email}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-caption text-muted">Role</span>
            <Segmented
              options={ROLE_OPTIONS}
              value={role}
              onChange={(r) => setRole(r as AppRole)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-caption text-muted">Status</span>
            <Segmented
              options={STATUS_OPTIONS}
              value={status}
              onChange={(s) => setStatus(s as AccountStatus)}
            />
          </div>

          {error && (
            <p role="alert" className="text-body-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            disabled={pending || !dirty}
            onClick={save}
          >
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
