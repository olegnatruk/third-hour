import { cn } from "@/lib/cn";

/**
 * Third Hour wordmark — pure type (Cormorant Garamond), per Figma
 * node 29:10. Inherits `color` from the current theme's foreground.
 */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 py-1 font-serif text-foreground",
        className,
      )}
    >
      <span className="text-[46px] font-semibold leading-none tracking-[0.02em]">
        T/H
      </span>
      <span className="text-[19px] font-semibold tracking-[0.14em]">
        THIRD HOUR
      </span>
      <span className="text-[10px] font-medium tracking-[0.34em]">CAFE</span>
    </div>
  );
}
