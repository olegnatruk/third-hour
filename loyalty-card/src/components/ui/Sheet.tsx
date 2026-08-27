import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Figma node 42:201 — top-rounded sheet surface with a drag handle. */
export function Sheet({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-t-[20px] border border-line bg-raised px-6 pb-8 pt-3 shadow-[var(--shadow-sheet)]",
        className,
      )}
    >
      <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-line" />
      {title && (
        <h1 className="mb-5 text-center text-display text-foreground">{title}</h1>
      )}
      {children}
    </div>
  );
}
