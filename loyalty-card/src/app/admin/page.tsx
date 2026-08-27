import { serverFetch } from "@/lib/api/server";
import type { AccountsResponse } from "@/lib/api/types";
import { TopBar } from "@/components/ui";
import { DirectoryList } from "./DirectoryList";

export default async function CustomerDirectoryPage() {
  const { accounts } = await serverFetch<AccountsResponse>(
    "/api/admin/accounts?limit=100",
  );

  return (
    <>
      <TopBar mode="back" title="Customers" backHref="/admin" />
      <DirectoryList accounts={accounts} />
    </>
  );
}
