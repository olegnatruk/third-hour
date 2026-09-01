"use client";

import { m, useReducedMotion } from "motion/react";
import { easeOut } from "./transitions";

/** Check mark that draws itself on mount (static under reduced motion). */
export function AnimatedCheck({ size = 30 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <m.path
        d="M5 13L9 17L19 7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeOut, delay: 0.12 }}
      />
    </svg>
  );
}
