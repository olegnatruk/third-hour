import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type SlotState = "empty" | "earned" | "reward";

function StampSlot({ state, number }: { state: SlotState; number: number }) {
  return (
    <div
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
        <span className="text-[13px] font-semibold [font-family:var(--font-serif)]">
          T/H
        </span>
      )}
      {state === "reward" && <Icon name="gift" size={22} />}
    </div>
  );
}

/**
 * 10-slot stamp card. Slots 1–9 fill as `T/H` monograms up to `count`
 * (the rest show their number); slot 10 is always the reward.
 */
export function StampGrid({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
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
            />
          ))}
          {rowIndex === 1 && <StampSlot number={10} state="reward" />}
        </div>
      ))}
    </div>
  );
}
