import { serverFetch } from "@/lib/api/server";
import type { LoyaltyCardResponse, SessionUser } from "@/lib/api/types";
import { LoyaltyCard, TopBar } from "@/components/ui";
import { HowItWorks } from "./HowItWorks";

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function MyCardPage() {
  const [{ user }, cards] = await Promise.all([
    serverFetch<{ user: SessionUser }>("/api/auth/me"),
    serverFetch<LoyaltyCardResponse>("/api/loyalty-card"),
  ]);

  const firstName = (user.displayName ?? "").trim().split(/\s+/)[0];
  const stamps = cards.activeCard?.stamp_count ?? 0;

  return (
    <>
      <TopBar mode="menu" />

      <div className="flex flex-col gap-5 px-7 pb-8 pt-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-display text-foreground">
            {greeting()}
            {firstName ? `, ${firstName}` : ""} :)
          </h1>
          <p className="text-body text-muted">
            Thank you for being part of Third Hour Cafe.
          </p>
        </div>

        <LoyaltyCard stampCount={stamps} />
      </div>

      <HowItWorks />
    </>
  );
}
