import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  /** Heading level for the document outline. Defaults to h1. */
  as?: "h1" | "h2";
  className?: string;
};

/** Figma node 29:17 — serif title + muted body subtitle. */
export function SectionHeading({
  title,
  subtitle,
  as: Tag = "h1",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Tag className="text-display text-foreground">{title}</Tag>
      {subtitle && <p className="text-body text-muted">{subtitle}</p>}
    </div>
  );
}
