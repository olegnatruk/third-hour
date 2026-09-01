"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { cn } from "@/lib/cn";
import { listContainer, listItem } from "./transitions";

/** Max children that animate; the rest render settled so long lists stay snappy. */
const CAP = 12;

export function StaggerList({
  children,
  resetKey,
  className,
}: {
  children: ReactNode;
  /** Change this to replay the stagger (e.g. active filter or tab). */
  resetKey?: string | number;
  className?: string;
}) {
  return (
    <m.ul
      key={resetKey}
      variants={listContainer}
      initial="hidden"
      animate="show"
      className={cn("flex flex-col", className)}
    >
      {children}
    </m.ul>
  );
}

export function StaggerItem({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  if (index >= CAP) {
    return <li className={className}>{children}</li>;
  }
  return (
    <m.li variants={listItem} className={className}>
      {children}
    </m.li>
  );
}
