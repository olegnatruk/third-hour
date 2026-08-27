import { serverFetch } from "@/lib/api/server";
import type {
  AccountsResponse,
  CustomerHistoryResponse,
} from "@/lib/api/types";
import { Sheet, TopBar } from "@/components/ui";
import { AdjustForm } from "./AdjustForm";

export default async function AdjustStampsPage({
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

  return (
    <>
      <TopBar
        mode="back"
        title="Customer History"
        backHref={`/admin/customers/${customerId}`}
      />

      <div className="mt-auto">
        <Sheet title="Adjust Stamps">
          <AdjustForm
            customerId={customerId}
            name={account?.display_name ?? account?.email ?? "Customer"}
            cardNumber={activeCard?.card_number ?? null}
            currentCount={activeCard?.stamp_count ?? 0}
          />
        </Sheet>
      </div>
    </>
  );
}
