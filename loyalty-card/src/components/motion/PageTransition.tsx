"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { durations, easeOut } from "./transitions";

/**
 * Wrapped by each area's `template.tsx`, which React re-mounts on every
 * in-segment navigation — so this plays an enter animation per route change.
 * Enter-only by design (no exit) to avoid a cross-fade flash on data pages.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.entrance, ease: easeOut }}
      className="flex flex-1 flex-col"
    >
      {children}
    </m.div>
  );
}
