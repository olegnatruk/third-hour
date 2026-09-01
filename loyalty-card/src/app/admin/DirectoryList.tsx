"use client";

import { useMemo, useState } from "react";
import { initials } from "@/lib/format";
import type { Account } from "@/lib/api/types";
import {
  Avatar,
  Icon,
  ListRow,
  Segmented,
  StatusBadge,
  EmptyState,
} from "@/components/ui";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";

type Filter = "all" | "active" | "suspended";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
] as const;

export function DirectoryList({ accounts }: { accounts: Account[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const customers = useMemo(
    () => accounts.filter((a) => a.role === "customer"),
    [accounts],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return (
        (a.display_name ?? "").toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [customers, query, filter]);

  return (
    <div className="flex flex-col gap-4 px-7 pb-8 pt-2">
      <div className="flex h-14 items-center gap-2.5 rounded-[14px] border border-line bg-field pl-[18px] pr-4">
        <Icon name="search" size={20} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email"
          aria-label="Search customers"
          className="min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted"
        />
      </div>

      <Segmented
        options={FILTERS}
        value={filter}
        onChange={(f) => setFilter(f as Filter)}
      />

      {visible.length === 0 ? (
        <EmptyState
          icon="search"
          title="No customers found"
          body="Try a different name, email, or filter."
        />
      ) : (
        <StaggerList resetKey={`${filter}:${visible.length}`}>
          {visible.map((a, i) => (
            <StaggerItem key={a.id} index={i}>
              <ListRow
                href={`/admin/customers/${a.id}`}
                divider={i < visible.length - 1}
                leading={<Avatar initials={initials(a.display_name, a.email)} />}
                primary={a.display_name ?? "—"}
                secondary={a.email}
                trailing={
                  <span className="flex items-center gap-2">
                    <StatusBadge
                      kind={a.status === "suspended" ? "suspended" : "active"}
                    />
                    <Icon
                      name="chevron-right"
                      size={20}
                      className="text-muted"
                    />
                  </span>
                }
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
