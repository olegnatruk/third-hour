import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type TopBarProps =
  | {
      mode: "menu";
      /** Left (menu) target. */
      menuHref?: string;
      /** Right (bell) target. */
      bellHref?: string;
      className?: string;
    }
  | {
      mode: "back";
      title: string;
      /** Back target; defaults to browser back via BackLink. */
      backHref?: string;
      right?: ReactNode;
      className?: string;
    };

export function TopBar(props: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between px-5 text-foreground",
        props.className,
      )}
    >
      {props.mode === "menu" ? (
        <>
          <Link
            href={props.menuHref ?? "/customer/profile"}
            aria-label="Menu"
            className="-ml-1 flex size-10 items-center justify-center"
          >
            <Icon name="menu" />
          </Link>
          <Link
            href={props.bellHref ?? "/customer/history"}
            aria-label="Activity"
            className="-mr-1 flex size-10 items-center justify-center"
          >
            <Icon name="bell" />
          </Link>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <Link
              href={props.backHref ?? "/customer"}
              aria-label="Back"
              className="-ml-1 flex size-10 items-center justify-center"
            >
              <Icon name="chevron-left" />
            </Link>
            <h1 className="text-[19px] font-semibold uppercase tracking-[0.06em] [font-family:var(--font-serif)]">
              {props.title}
            </h1>
          </div>
          <div className="flex size-6 items-center justify-center">
            {props.right}
          </div>
        </>
      )}
    </header>
  );
}
