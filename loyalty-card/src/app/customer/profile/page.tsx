import { serverFetch } from "@/lib/api/server";
import { initials } from "@/lib/format";
import type { SessionUser } from "@/lib/api/types";
import {
  Avatar,
  Icon,
  ListRow,
  Panel,
  StatusBadge,
  TopBar,
  type StatusKind,
} from "@/components/ui";
import { SignOutButton } from "./SignOutButton";

const ROLE_BADGE: Partial<Record<SessionUser["role"], StatusKind>> = {
  cashier: "staff",
  admin: "admin",
  owner: "owner",
};

export default async function ProfilePage() {
  const { user } = await serverFetch<{ user: SessionUser }>("/api/auth/me");
  const badge = ROLE_BADGE[user.role];

  return (
    <>
      <TopBar mode="back" title="Profile" backHref="/customer" />

      <div className="flex flex-col gap-5 px-7 pb-8 pt-2">
        <Panel className="flex items-center gap-3 p-4">
          <span className="[&>span]:size-12 [&>span]:text-[15px]">
            <Avatar initials={initials(user.displayName, user.email)} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-body text-foreground">
              {user.displayName ?? "Third Hour member"}
            </span>
            <span className="truncate text-body-sm text-muted">{user.email}</span>
          </span>
          {badge ? (
            <StatusBadge kind={badge} />
          ) : (
            <span className="text-caption text-muted">Member</span>
          )}
        </Panel>

        <nav className="flex flex-col">
          <ListRow
            href="/customer/qr"
            primary="My QR code"
            trailing={<Icon name="chevron-right" size={20} className="text-muted" />}
          />
          <ListRow
            href="/customer/completed"
            primary="Completed cards"
            trailing={<Icon name="chevron-right" size={20} className="text-muted" />}
          />
          <ListRow
            href="/customer/settings"
            primary="Settings"
            divider={false}
            trailing={<Icon name="chevron-right" size={20} className="text-muted" />}
          />
        </nav>

        <SignOutButton />
      </div>
    </>
  );
}
