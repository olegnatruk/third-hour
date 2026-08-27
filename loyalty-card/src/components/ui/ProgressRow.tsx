import { cn } from "@/lib/cn";

/** Figma node 31:32 — count, gold progress bar, helper message. */
export function ProgressRow({
  count,
  total = 10,
  message,
  className,
}: {
  count: number;
  total?: number;
  message?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (count / total) * 100));
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <p className="text-stamp text-foreground">
        {count} / {total}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-[3px] bg-line">
        <div
          className="h-full rounded-[3px] bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {message && <p className="text-body-sm text-muted">{message}</p>}
    </div>
  );
}
