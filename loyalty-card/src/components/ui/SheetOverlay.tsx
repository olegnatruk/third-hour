"use client";

import { useEffect, type ReactNode } from "react";
import { m } from "motion/react";
import { spring } from "@/components/motion/transitions";
import { Sheet } from "./Sheet";

/**
 * Animated bottom-sheet overlay: backdrop fade + slide-up spring.
 * Wrap the call site in <AnimatePresence> so the exit animation plays.
 */
export function SheetOverlay({
  title,
  onClose,
  children,
}: {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col justify-end">
      <m.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <m.div
        className="relative"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring}
      >
        <Sheet title={title}>{children}</Sheet>
      </m.div>
    </div>
  );
}
