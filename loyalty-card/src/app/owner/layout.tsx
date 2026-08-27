import type { ReactNode } from "react";
import { requirePageRole } from "@/lib/auth/session";

export default async function OwnerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePageRole(["owner"]);
  return <div className="flex min-h-dvh flex-col bg-background">{children}</div>;
}
