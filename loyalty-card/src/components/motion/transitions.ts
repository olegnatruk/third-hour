import type { Transition, Variants } from "motion/react";

/** Shared motion presets — keep every animation in the same voice. */

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
  mass: 0.9,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 28,
};

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const durations = {
  micro: 0.15,
  entrance: 0.24,
  celebration: 0.7,
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.entrance, ease: easeOut },
  },
};

export const listContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: easeOut },
  },
};
