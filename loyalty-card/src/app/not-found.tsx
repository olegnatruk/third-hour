import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-7">
      <EmptyState
        icon="search"
        title="Page not found"
        body="That page doesn't exist or has moved."
      />
      <Link
        href="/"
        className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[var(--btn-primary)] px-6 text-[var(--btn-primary-fg)]"
      >
        Go home
      </Link>
    </div>
  );
}
