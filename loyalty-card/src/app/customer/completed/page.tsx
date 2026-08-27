import { serverFetch } from "@/lib/api/server";
import {
  isRewardRedeemed,
  type CustomerRewardsResponse,
  type LoyaltyCardResponse,
} from "@/lib/api/types";
import { EmptyState, Panel, StatusBadge, TopBar } from "@/components/ui";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MiniCard() {
  return (
    <span
      className="flex h-[42px] w-16 shrink-0 items-center justify-center rounded-md border border-line"
      style={{ background: "linear-gradient(to bottom, #3c3a38, #0b0b0b)" }}
    >
      <span className="text-[11px] font-semibold text-foreground [font-family:var(--font-serif)]">
        T/H
      </span>
    </span>
  );
}

export default async function CompletedCardsPage() {
  const [cards, rewardData] = await Promise.all([
    serverFetch<LoyaltyCardResponse>("/api/loyalty-card"),
    serverFetch<CustomerRewardsResponse>("/api/loyalty-card/rewards"),
  ]);

  const completed = cards.completedCards ?? [];
  const rewards = rewardData.rewards ?? [];
  const redeemedCardIds = new Set(
    rewards.filter(isRewardRedeemed).map((r) => r.card_id),
  );
  const availableCount = rewards.filter((r) => !isRewardRedeemed(r)).length;

  return (
    <>
      <TopBar mode="back" title="Completed Cards" backHref="/customer" />

      <div className="flex flex-col gap-4 px-7 pb-8 pt-2">
        {completed.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            body="Your completed cards will appear here once you fill one."
          />
        ) : (
          <>
            <p className="text-caption text-muted">
              {completed.length} completed
              {availableCount > 0 && (
                <> &middot; {availableCount} reward available</>
              )}
            </p>

            <ul className="flex flex-col gap-3">
              {completed.map((card) => {
                const redeemed = redeemedCardIds.has(card.id);
                return (
                  <li key={card.id}>
                    <Panel className="flex items-center gap-3 p-4">
                      <MiniCard />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-[17px] text-foreground [font-family:var(--font-serif)]">
                          Card{" "}
                          <span className="text-[13px] align-middle text-muted">
                            #{card.card_number}
                          </span>
                        </span>
                        <span className="text-body-sm text-muted">
                          Completed {formatDate(card.completed_at)}
                        </span>
                      </span>
                      <StatusBadge kind={redeemed ? "redeemed" : "available"} />
                    </Panel>
                  </li>
                );
              })}
            </ul>

            <p className="text-body-sm text-muted">
              Completed cards stay in your collection forever, even after the
              reward is redeemed.
            </p>
          </>
        )}
      </div>
    </>
  );
}
