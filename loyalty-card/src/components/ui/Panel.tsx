import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Bordered rounded surface used for cards, list containers, sheets. */
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[14px] border border-line bg-raised", className)}
      {...props}
    />
  );
}
