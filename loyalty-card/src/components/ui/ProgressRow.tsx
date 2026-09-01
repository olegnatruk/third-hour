"use client";

import { m } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/components/motion/transitions";

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
        <m.div
          className="h-full rounded-[3px] bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: easeOut }}
        />
      </div>
      {message && <p className="text-body-sm text-muted">{message}</p>}
    </div>
  );
}
