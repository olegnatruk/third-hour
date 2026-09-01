"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { CoffeePourLoader } from "@/components/ui";
import { NAVIGATION_START_EVENT } from "./navigationLoading";

const MIN_VISIBLE_MS = 760;
const MAX_VISIBLE_MS = 7000;

/**
 * Provides a guaranteed visual handoff for internal links. App Router's
 * `loading.tsx` remains the server fallback; this handles prefetched pages
 * that would otherwise navigate too quickly to reveal it.
 */
export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const routeKey = pathname ?? "/";
  const previousRouteRef = useRef(routeKey);
  const startedAtRef = useRef<number | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  const clearTimers = useCallback(() => {
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    if (failsafeTimerRef.current) window.clearTimeout(failsafeTimerRef.current);
    settleTimerRef.current = null;
    failsafeTimerRef.current = null;
  }, []);

  const finishNavigation = useCallback(() => {
    const elapsed = startedAtRef.current
      ? performance.now() - startedAtRef.current
      : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      startedAtRef.current = null;
      if (failsafeTimerRef.current) window.clearTimeout(failsafeTimerRef.current);
      settleTimerRef.current = null;
      failsafeTimerRef.current = null;
    }, remaining);
  }, []);

  const startNavigation = useCallback(() => {
    if (startedAtRef.current === null) startedAtRef.current = performance.now();
    clearTimers();
    setVisible(true);
    failsafeTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      startedAtRef.current = null;
      failsafeTimerRef.current = null;
    }, MAX_VISIBLE_MS);
  }, [clearTimers]);

  useEffect(() => {
    if (routeKey === previousRouteRef.current) return;
    previousRouteRef.current = routeKey;
    finishNavigation();
  }, [finishNavigation, routeKey]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target ||
        link.hasAttribute("download") ||
        link.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      const nextUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSamePage =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (
        nextUrl.origin !== currentUrl.origin ||
        nextUrl.pathname.startsWith("/api/") ||
        isSamePage
      ) {
        return;
      }

      startNavigation();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, startNavigation);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, startNavigation);
      clearTimers();
    };
  }, [clearTimers, startNavigation]);

  return (
    <>
      {children}
      <AnimatePresence initial={false}>
        {visible && (
          <m.div
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="navigation-loader"
          >
            <CoffeePourLoader label="Brewing your next page" />
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
