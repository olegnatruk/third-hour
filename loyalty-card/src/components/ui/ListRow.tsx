import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/** Round 40px leading slot — bordered avatar with initials. */
export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-raised text-[13px] font-semibold text-foreground">
      {initials}
    </span>
  );
}

/** Round 40px leading slot — borderless icon chip (history / reward rows). */
export function IconChip({ name }: { name: IconName }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-raised text-foreground">
      <Icon name={name} size={20} />
    </span>
  );
}

type ListRowProps = {
  leading?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  className?: string;
  /** Drop the bottom divider (e.g. last row). */
  divider?: boolean;
};

/** Figma node 41:135 — leading chip, primary/secondary text, trailing slot. */
export function ListRow({
  leading,
  primary,
  secondary,
  trailing,
  href,
  className,
  divider = true,
}: ListRowProps) {
  const content = (
    <>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="truncate text-body text-foreground">{primary}</span>
        {secondary && (
          <span className="truncate text-body-sm text-muted">{secondary}</span>
        )}
      </span>
      {trailing}
    </>
  );

  const base = cn(
    "flex items-center gap-3 px-1 py-3.5",
    divider && "border-b border-line",
    href && "transition-colors active:bg-raised/60",
    className,
  );

  return href ? (
    <Link href={href} className={base}>
      {content}
    </Link>
  ) : (
    <div className={base}>{content}</div>
  );
}
