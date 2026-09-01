"use client";

import { useState } from "react";
import {
  isRewardRedeemed,
  type CustomerHistoryResponse,
  type StampTransaction,
} from "@/lib/api/types";
import {
  IconChip,
  ListRow,
  Segmented,
  StatusBadge,
  EmptyState,
} from "@/components/ui";
import type { IconName } from "@/components/ui";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";

type Tab = "stamps" | "cards" | "rewards";

const TABS = [
  { value: "stamps", label: "Stamps" },
  { value: "cards", label: "Cards" },
  { value: "rewards", label: "Rewards" },
] as const;

function txMeta(t: StampTransaction): {
  label: string;
  icon: IconName;
  delta: string;
  tone: string;
} {
  const positive = t.stamp_change > 0;
  const delta = t.stamp_change > 0 ? `+${t.stamp_change}` : `${t.stamp_change}`;
  switch (t.transaction_type) {
    case "earned":
      return { label: "Stamp earned", icon: "plus", delta, tone: "text-success" };
    case "redeemed":
      return {
        label: "Reward redeemed",
        icon: "gift",
        delta: "",
        tone: "text-muted",
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

function dateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryTabs({ history }: { history: CustomerHistoryResponse }) {
  const [tab, setTab] = useState<Tab>("stamps");

  return (
    <div className="flex flex-col gap-4">
      <Segmented options={TABS} value={tab} onChange={(t) => setTab(t as Tab)} />

      {tab === "stamps" &&
        (history.transactions.length === 0 ? (
          <EmptyState icon="history" title="No stamp activity" />
        ) : (
          <StaggerList resetKey="stamps">
            {history.transactions.map((t, i) => {
              const m = txMeta(t);
              return (
                <StaggerItem key={t.id} index={i}>
                  <ListRow
                    divider={i < history.transactions.length - 1}
                    leading={<IconChip name={m.icon} />}
                    primary={m.label}
                    secondary={
                      t.reason
                        ? `${dateTime(t.created_at)} · ${t.reason}`
                        : dateTime(t.created_at)
                    }
                    trailing={
                      m.delta ? (
                        <span className={`text-body font-semibold ${m.tone}`}>
                          {m.delta}
                        </span>
                      ) : undefined
                    }
                  />
                </StaggerItem>
              );
            })}
          </StaggerList>
        ))}

      {tab === "cards" && (
        <StaggerList resetKey="cards">
          {history.cards.map((c, i) => (
            <StaggerItem key={c.id} index={i}>
              <ListRow
                divider={i < history.cards.length - 1}
                primary={`Card #${c.card_number}`}
                secondary={
                  c.status === "active"
                    ? `Active · ${c.stamp_count} / 10`
                    : `Completed ${c.completed_at ? new Date(c.completed_at).toLocaleDateString() : ""}`
                }
                trailing={
                  <StatusBadge
                    kind={c.status === "active" ? "active" : "redeemed"}
                    label={c.status === "active" ? "Active" : "Complete"}
                  />
                }
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}

      {tab === "rewards" &&
        (history.rewards.length === 0 ? (
          <EmptyState icon="gift" title="No rewards yet" />
        ) : (
          <StaggerList resetKey="rewards">
            {history.rewards.map((r, i) => (
              <StaggerItem key={r.id} index={i}>
                <ListRow
                  divider={i < history.rewards.length - 1}
                  leading={<IconChip name="gift" />}
                  primary={r.reward_name}
                  secondary={new Date(r.created_at).toLocaleDateString()}
                  trailing={
                    <StatusBadge
                      kind={isRewardRedeemed(r) ? "redeemed" : "available"}
                    />
                  }
                />
              </StaggerItem>
            ))}
          </StaggerList>
        ))}
    </div>
  );
}
