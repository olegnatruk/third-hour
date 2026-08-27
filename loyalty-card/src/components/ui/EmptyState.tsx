import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/** Figma node 42:219 — icon badge + serif title + muted body. */
export function EmptyState({
  icon = "gift",
  title,
  body,
  className,
}: {
  icon?: IconName;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-8 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full border border-line bg-raised text-foreground">
        <Icon name={icon} />
      </span>
      <h2 className="text-display text-foreground">{title}</h2>
      {body && <p className="text-body text-muted">{body}</p>}
    </div>
  );
}
