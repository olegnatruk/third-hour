"use client";

import { cn } from "@/lib/cn";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex rounded-full border border-line bg-raised p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "text-caption flex-1 rounded-full px-3 py-2 transition-colors",
              active
                ? "bg-[var(--btn-primary)] text-[var(--btn-primary-fg)]"
                : "text-muted",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
