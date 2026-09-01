"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

/**
 * App-wide motion setup.
 * - `LazyMotion` + `domAnimation` keeps the animation bundle small (~18kb);
 *   `strict` forbids the heavy `motion.*` namespace so only `m.*` is used.
 * - `reducedMotion="user"` makes every transform/layout animation collapse to a
 *   crossfade when the OS "Reduce motion" setting is on.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
