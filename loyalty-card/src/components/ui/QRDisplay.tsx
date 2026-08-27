import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type QrState = "active" | "expiring" | "expired" | "success";

const CAPTION: Record<
  QrState,
  { headline: (c?: string) => string; sub: string; tone: string }
> = {
  active: {
    headline: (c) => c ?? "",
    sub: "Code refreshes every 60 seconds",
    tone: "text-accent",
  },
  expiring: {
    headline: (c) => c ?? "",
    sub: "Code refreshes every 60 seconds",
    tone: "text-warning",
  },
  expired: {
    headline: () => "Expired",
    sub: "Generate a new code to continue",
    tone: "text-[var(--danger)]",
  },
  success: {
    headline: () => "Scanned!",
    sub: "Stamp added by staff",
    tone: "text-success",
  },
};

/**
 * Figma node 42:200 — white QR tile with a status caption.
 * Pass the rendered QR (e.g. an <img>) as `qr`.
 */
export function QRDisplay({
  state,
  countdown,
  qr,
}: {
  state: QrState;
  countdown?: string;
  qr?: ReactNode;
}) {
  const caption = CAPTION[state];
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div
        className={cn(
          "grid size-[216px] place-items-center rounded-[14px] bg-white p-[18px]",
          state === "expired" && "opacity-30",
        )}
      >
        {state === "success" ? (
          <span className="flex size-24 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" size={28} />
          </span>
        ) : (
          <div className="size-[180px] [&>img]:size-full [&>img]:[image-rendering:pixelated]">
            {qr}
          </div>
        )}
      </div>

      <p className={cn("text-[22px] font-semibold leading-none", caption.tone)}>
        {caption.headline(countdown)}
      </p>
      <p className="text-body-sm text-muted">{caption.sub}</p>
    </div>
  );
}
