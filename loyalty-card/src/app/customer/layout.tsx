import type { ReactNode } from "react";
import { requirePageUser } from "@/lib/auth/session";
import { BottomTabBar } from "@/components/ui";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePageUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomTabBar />
    </div>
  );
}
