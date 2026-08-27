import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/** Bordered helper panel: leading icon + muted text. */
export function InfoNote({
  icon = "alert",
  children,
  tone = "line",
  className,
}: {
  icon?: IconName;
  children: ReactNode;
  tone?: "line" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[14px] border bg-raised p-3.5",
        tone === "accent" ? "border-accent" : "border-line",
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-muted">
        <Icon name={icon} size={18} />
      </span>
      <p className="text-body-sm text-muted">{children}</p>
    </div>
  );
}
