"use client";

import { useState } from "react";
import { m } from "motion/react";
import { cn } from "@/lib/cn";
import { spring } from "@/components/motion/transitions";
import { Icon } from "./Icon";

type SlotState = "empty" | "earned" | "reward";

function StampSlot({
  state,
  number,
  animate,
}: {
  state: SlotState;
  number: number;
  animate: boolean;
}) {
  return (
    <m.div
      initial={animate ? { scale: 0.5 } : false}
      animate={animate ? { scale: 1 } : undefined}
      transition={spring}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border-[1.5px]",
        state === "reward"
          ? "border-solid border-stamp-fill bg-background text-stamp-fill"
          : "border-dashed border-stamp-ring bg-stamp-fill text-[#1a1512]",
      )}
    >
      {state === "empty" && (
        <span className="text-[15px] font-semibold [font-family:var(--font-sans)]">
          {number}
        </span>
      )}
      {state === "earned" && (
        <m.span
          key="th"
          initial={animate ? { opacity: 0, scale: 0.5 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: 0.06, ...spring }}
          className="text-[13px] font-semibold [font-family:var(--font-serif)]"
        >
          T/H
        </m.span>
      )}
      {state === "reward" && <Icon name="gift" size={22} />}
    </m.div>
  );
}

/**
 * 10-slot stamp card. Slots 1–9 fill as `T/H` monograms up to `count`; slot 10
 * is always the reward. When `count` increases, only the newly earned slots pop.
 */
export function StampGrid({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  // Derive the "newly earned" range by comparing against the previous count —
  // the React-sanctioned adjust-state-during-render pattern (no effect).
  const [prevCount, setPrevCount] = useState(count);
  const [animateFrom, setAnimateFrom] = useState<number | null>(null);
  if (count !== prevCount) {
    setAnimateFrom(count > prevCount ? prevCount : null);
    setPrevCount(count);
  }

  const slots = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {[slots.slice(0, 5), slots.slice(5, 9)].map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-between">
          {row.map((n) => (
            <StampSlot
              key={n}
              number={n}
              state={n <= count ? "earned" : "empty"}
              animate={animateFrom !== null && n > animateFrom && n <= count}
            />
          ))}
          {rowIndex === 1 && (
            <StampSlot number={10} state="reward" animate={false} />
          )}
        </div>
      ))}
    </div>
  );
}
