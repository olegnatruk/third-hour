import Link from "next/link";
import { serverFetch } from "@/lib/api/server";
import { initials } from "@/lib/format";
import type {
  AccountsResponse,
  CustomerHistoryResponse,
} from "@/lib/api/types";
import {
  Avatar,
  Panel,
  ProgressRow,
  StatusBadge,
  TopBar,
} from "@/components/ui";
import { HistoryTabs } from "./HistoryTabs";

export default async function CustomerHistoryPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const [history, accountsRes] = await Promise.all([
    serverFetch<CustomerHistoryResponse>(
      `/api/admin/customers/${customerId}/history`,
    ),
    serverFetch<AccountsResponse>("/api/admin/accounts?limit=100"),
  ]);

  const account = accountsRes.accounts.find((a) => a.id === customerId);
  const activeCard = history.cards.find((c) => c.status === "active");
  const name = account?.display_name ?? "Customer";

  return (
    <>
      <TopBar
        mode="back"
        title={name}
        backHref="/admin"
        right={
          <Link
            href={`/admin/customers/${customerId}/adjust`}
            aria-label="Adjust stamps"
            className="text-caption text-accent"
          >
            Adjust
          </Link>
        }
      />

      <div className="flex flex-col gap-5 px-7 pb-8 pt-2">
        <Panel className="flex items-center gap-3 p-4">
          <span className="[&>span]:size-12">
            <Avatar initials={initials(account?.display_name, account?.email)} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-body text-foreground">
              {account?.email ?? customerId}
            </span>
            <span className="text-body-sm text-muted">
              {account
                ? `${account.role[0].toUpperCase()}${account.role.slice(1)} · Joined ${new Date(
                    account.created_at,
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}`
                : ""}
            </span>
          </span>
          {account && (
            <StatusBadge
              kind={account.status === "suspended" ? "suspended" : "active"}
            />
          )}
        </Panel>

        {activeCard && (
          <div className="flex flex-col gap-2">
            <p className="text-caption text-muted">
              Active card · Card #{activeCard.card_number}
            </p>
            <ProgressRow
              count={activeCard.stamp_count}
              message={`Customer needs ${10 - activeCard.stamp_count} more ${
                10 - activeCard.stamp_count === 1 ? "stamp" : "stamps"
              } to complete this card`}
            />
          </div>
        )}

        <HistoryTabs history={history} />

        <Link
          href={`/admin/customers/${customerId}/adjust`}
          className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[var(--btn-secondary-line)] bg-[var(--btn-secondary)] px-6 text-[var(--btn-secondary-fg)]"
        >
          Adjust stamps
        </Link>
      </div>
    </>
  );
}
