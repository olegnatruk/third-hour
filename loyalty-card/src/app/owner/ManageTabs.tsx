"use client";

import { useState } from "react";
import { initials } from "@/lib/format";
import type { Account, RewardDefinition } from "@/lib/api/types";
import {
  Avatar,
  Icon,
  InfoNote,
  ListRow,
  Panel,
  Segmented,
  StatusBadge,
  type StatusKind,
} from "@/components/ui";
import { AccountEditor } from "./AccountEditor";
import { RewardEditor } from "./RewardEditor";

type Tab = "accounts" | "reward";

const TABS = [
  { value: "accounts", label: "Accounts" },
  { value: "reward", label: "Reward" },
] as const;

const ROLE_BADGE: Record<Account["role"], StatusKind> = {
  customer: "active",
  cashier: "staff",
  admin: "admin",
  owner: "owner",
};

export function ManageTabs({
  accounts,
  reward,
  currentUserId,
}: {
  accounts: Account[];
  reward: RewardDefinition | null;
  currentUserId: string;
}) {
  const [tab, setTab] = useState<Tab>("accounts");
  const [editing, setEditing] = useState<Account | null>(null);
  const [editingReward, setEditingReward] = useState(false);

  return (
    <div className="flex flex-col gap-4 px-7 pb-8 pt-2">
      <Segmented options={TABS} value={tab} onChange={(t) => setTab(t as Tab)} />

      {tab === "accounts" ? (
        <>
          <ul className="flex flex-col">
            {accounts.map((a, i) => {
              const locked = a.role === "owner" || a.id === currentUserId;
              const label =
                a.id === currentUserId
                  ? `${a.display_name ?? "You"} (Owner)`
                  : (a.display_name ?? "—");
              const badge: StatusKind =
                a.status === "suspended" ? "suspended" : ROLE_BADGE[a.role];
              const badgeLabel =
                a.status === "suspended"
                  ? "Suspended"
                  : a.role[0].toUpperCase() + a.role.slice(1);

              const trailing = (
                <span className="flex items-center gap-2">
                  <StatusBadge kind={badge} label={badgeLabel} />
                  {!locked && (
                    <Icon
                      name="chevron-right"
                      size={20}
                      className="text-muted"
                    />
                  )}
                </span>
              );

              return (
                <li key={a.id} className={locked ? "opacity-60" : undefined}>
                  {locked ? (
                    <ListRow
                      divider={i < accounts.length - 1}
                      leading={
                        <Avatar initials={initials(a.display_name, a.email)} />
                      }
                      primary={label}
                      secondary={a.email}
                      trailing={trailing}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(a)}
                      className="w-full text-left"
                    >
                      <ListRow
                        divider={i < accounts.length - 1}
                        leading={
                          <Avatar initials={initials(a.display_name, a.email)} />
                        }
                        primary={label}
                        secondary={a.email}
                        trailing={trailing}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <InfoNote>
            Tap an account to change its role (Customer · Cashier · Admin) or
            suspend / reactivate it. The owner account can&rsquo;t be edited here.
          </InfoNote>
        </>
      ) : (
        <>
          <Panel className="flex flex-col gap-2 p-5">
            <span className="text-caption text-accent">Active reward</span>
            <span className="text-display-lg text-foreground">
              {reward?.name ?? "No active reward"}
            </span>
            {reward?.description && (
              <span className="text-body text-muted">{reward.description}</span>
            )}
          </Panel>

          <button
            type="button"
            onClick={() => setEditingReward(true)}
            className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[var(--btn-secondary-line)] bg-[var(--btn-secondary)] px-6 text-[var(--btn-secondary-fg)]"
          >
            Edit reward
          </button>

          <InfoNote tone="accent">
            New completed cards use whichever reward is active at that moment.
          </InfoNote>
        </>
      )}

      {editing && (
        <AccountEditor account={editing} onClose={() => setEditing(null)} />
      )}
      {editingReward && (
        <RewardEditor
          initialName={reward?.name ?? ""}
          initialDescription={reward?.description ?? ""}
          onClose={() => setEditingReward(false)}
        />
      )}
    </div>
  );
}
