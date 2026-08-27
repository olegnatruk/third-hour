import { serverFetch } from "@/lib/api/server";
import type {
  AccountsResponse,
  RewardDefinitionsResponse,
  SessionUser,
} from "@/lib/api/types";
import { TopBar } from "@/components/ui";
import { ManageTabs } from "./ManageTabs";

export default async function ManagePage() {
  const [{ user }, accountsRes, rewardsRes] = await Promise.all([
    serverFetch<{ user: SessionUser }>("/api/auth/me"),
    serverFetch<AccountsResponse>("/api/admin/accounts?limit=100"),
    serverFetch<RewardDefinitionsResponse>("/api/admin/rewards"),
  ]);

  const reward =
    rewardsRes.rewards.find((r) => r.is_active) ?? rewardsRes.rewards[0] ?? null;

  return (
    <>
      <TopBar mode="back" title="Manage" backHref="/owner" />
      <ManageTabs
        accounts={accountsRes.accounts}
        reward={reward}
        currentUserId={user.id}
      />
    </>
  );
}
