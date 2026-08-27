import { cn } from "@/lib/cn";

export type StatusKind =
  | "active"
  | "suspended"
  | "available"
  | "redeemed"
  | "pending"
  | "staff"
  | "admin"
  | "owner";

const TONE: Record<StatusKind, string> = {
  active: "text-[var(--success)] border-[var(--success)]",
  available: "text-[var(--success)] border-[var(--success)]",
  staff: "text-[var(--success)] border-[var(--success)]",
  admin: "text-[var(--accent)] border-[var(--accent)]",
  owner: "text-[var(--accent)] border-[var(--accent)]",
  pending: "text-[var(--warning)] border-[var(--warning)]",
  redeemed: "text-[var(--muted)] border-[var(--muted)]",
  suspended: "text-[var(--danger)] border-[var(--danger)]",
};

const DEFAULT_LABEL: Record<StatusKind, string> = {
  active: "Active",
  suspended: "Suspended",
  available: "Available",
  redeemed: "Redeemed",
  pending: "Pending",
  staff: "Staff",
  admin: "Admin",
  owner: "Owner",
};

/** Figma node 33:28 — dot + label pill. */
export function StatusBadge({
  kind,
  label,
  className,
}: {
  kind: StatusKind;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center gap-1.5 rounded-full border bg-raised py-[5px] pl-2.5 pr-[11px]",
        TONE[kind],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? DEFAULT_LABEL[kind]}
    </span>
  );
}
