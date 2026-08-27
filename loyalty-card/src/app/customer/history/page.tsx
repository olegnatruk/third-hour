import { serverFetch } from "@/lib/api/server";
import type { StampTransaction, TransactionsResponse } from "@/lib/api/types";
import { EmptyState, IconChip, ListRow, TopBar } from "@/components/ui";
import type { IconName } from "@/components/ui";

function describe(t: StampTransaction): {
  label: string;
  icon: IconName;
  delta: string;
  tone: string;
} {
  const positive = t.stamp_change > 0;
  const delta =
    t.stamp_change > 0
      ? `+${t.stamp_change}`
      : t.stamp_change < 0
        ? `${t.stamp_change}`
        : "";

  switch (t.transaction_type) {
    case "earned":
      return { label: "Stamp earned", icon: "plus", delta, tone: "text-success" };
    case "redeemed":
      return {
        label: "Reward redeemed",
        icon: "gift",
        delta,
        tone: "text-[var(--muted)]",
      };
    case "manual_adjustment":
      return {
        label: "Manual adjustment",
        icon: positive ? "plus" : "minus",
        delta,
        tone: positive ? "text-success" : "text-[var(--danger)]",
      };
    case "reversal":
      return {
        label: "Reversal",
        icon: "refresh",
        delta,
        tone: "text-[var(--danger)]",
      };
    default:
      return {
        label: t.transaction_type,
        icon: positive ? "plus" : "minus",
        delta,
        tone: "text-muted",
      };
  }
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const { transactions } = await serverFetch<TransactionsResponse>(
    "/api/loyalty-card/transactions?limit=50",
  );

  return (
    <>
      <TopBar mode="back" title="History" backHref="/customer" />

      <div className="flex flex-col px-7 pb-8 pt-2">
        {transactions.length === 0 ? (
          <EmptyState
            icon="history"
            title="No activity yet"
            body="Your stamp history will show up here after your first visit."
          />
        ) : (
          <ul className="flex flex-col">
            {transactions.map((t, i) => {
              const d = describe(t);
              return (
                <li key={t.id}>
                  <ListRow
                    divider={i < transactions.length - 1}
                    leading={<IconChip name={d.icon} />}
                    primary={d.label}
                    secondary={formatDateTime(t.created_at)}
                    trailing={
                      d.delta ? (
                        <span
                          className={`text-body font-semibold ${d.tone}`}
                        >
                          {d.delta}
                        </span>
                      ) : undefined
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
