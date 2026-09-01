import { cn } from "@/lib/cn";
import { StampGrid } from "./StampGrid";

/**
 * The branded virtual loyalty card — metallic header + tagline + stamp grid.
 * Figma node 36:93.
 */
export function LoyaltyCard({
  stampCount,
  className,
}: {
  stampCount: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[20px] border border-line bg-raised",
        className,
      )}
    >
      <div className="loyalty-card__header flex h-[166px] items-start justify-between rounded-b-[14px] border-b border-[rgb(190_198_208/0.35)] p-[22px]">
        <div className="relative z-10 flex flex-col items-center justify-center gap-[1px] py-0.5 font-serif text-foreground">
          <span className="text-[28px] font-semibold leading-none tracking-[0.02em]">
            T/H
          </span>
          <span className="text-[12px] font-semibold tracking-[0.14em]">
            THIRD HOUR
          </span>
          <span className="text-[6px] font-medium tracking-[0.34em]">CAFE</span>
        </div>
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(214_219_225/0.76)] [font-family:var(--font-serif)]">
          Loyalty Card
        </span>
        <span aria-hidden="true" className="loyalty-card__shine" />
      </div>

      <div className="flex flex-col gap-4 px-5 pb-[22px] pt-[18px]">
        <p className="text-body text-foreground">
          Buy 9 drinks,
          <br />
          get the 10th one FREE!
        </p>
        <StampGrid count={stampCount} />
      </div>
    </div>
  );
}
