import type { ReactNode } from "react";
import { requirePageRole } from "@/lib/auth/session";

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePageRole(["cashier", "admin", "owner"]);
  return <div className="flex min-h-dvh flex-col bg-background">{children}</div>;
}
