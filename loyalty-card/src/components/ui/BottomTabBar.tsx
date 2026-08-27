"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type TabKey = "home" | "history" | "qr" | "profile" | "settings";

const TABS: {
  key: TabKey;
  href: string;
  icon: IconName;
  label: string;
  match: (p: string) => boolean;
}[] = [
  {
    key: "home",
    href: "/customer",
    icon: "home",
    label: "Home",
    match: (p) => p === "/customer",
  },
  {
    key: "history",
    href: "/customer/history",
    icon: "history",
    label: "History",
    match: (p) =>
      p.startsWith("/customer/history") || p.startsWith("/customer/completed"),
  },
  {
    key: "qr",
    href: "/customer/qr",
    icon: "qr",
    label: "QR",
    match: (p) => p.startsWith("/customer/qr"),
  },
  {
    key: "profile",
    href: "/customer/profile",
    icon: "profile",
    label: "Profile",
    match: (p) => p.startsWith("/customer/profile"),
  },
  {
    key: "settings",
    href: "/customer/settings",
    icon: "settings",
    label: "Settings",
    match: (p) => p.startsWith("/customer/settings"),
  },
];

export function BottomTabBar() {
  const pathname = usePathname() ?? "/customer";

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 flex h-[76px] items-stretch justify-between border-t border-line bg-raised px-2 pb-4 pt-2.5"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);

        if (tab.key === "qr") {
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-label="My QR code"
              aria-current={active ? "page" : undefined}
              className="flex flex-1 items-center justify-center"
            >
              <span
                className={cn(
                  "flex size-14 items-center justify-center rounded-full bg-background text-foreground",
                  active
                    ? "border-2 border-accent"
                    : "border border-line text-muted",
                )}
              >
                <Icon name="qr" />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1.5",
              active ? "text-foreground" : "text-muted",
            )}
          >
            <Icon name={tab.icon} size={22} />
            <span className="text-caption">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
