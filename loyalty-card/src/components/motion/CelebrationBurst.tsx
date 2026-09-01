"use client";

import { m, useReducedMotion } from "motion/react";
import { durations } from "./transitions";

const DOTS = 12;
const COLORS = ["var(--accent)", "#f7f1e5", "var(--success)"];

/**
 * One-shot card-completion flourish: an expanding halo ring plus a dozen dots
 * flung outward. Purely decorative and transform-only — renders nothing when the
 * viewer prefers reduced motion. Place inside a `relative` container; it centers
 * on that box and does not affect layout.
 */
export function CelebrationBurst() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <m.span
        className="absolute rounded-full border border-accent"
        style={{ width: 96, height: 96 }}
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: durations.celebration, ease: "easeOut" }}
      />
      {Array.from({ length: DOTS }).map((_, i) => {
        const angle = (i / DOTS) * Math.PI * 2 + (i % 2 ? 0.26 : 0);
        const distance = 70 + (i % 3) * 22;
        return (
          <m.span
            key={i}
            className="absolute size-1.5 rounded-full"
            style={{ background: COLORS[i % COLORS.length] }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: [0.4, 1, 0.6],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: durations.celebration,
              ease: "easeOut",
              delay: 0.04 + (i % 4) * 0.03,
            }}
          />
        );
      })}
    </div>
  );
}
