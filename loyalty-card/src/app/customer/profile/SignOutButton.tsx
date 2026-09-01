"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { startNavigationLoader } from "@/components/motion/navigationLoading";
import { Button } from "@/components/ui";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          await apiFetch("/api/auth/sign-out", { method: "POST" });
        } catch {
          // ignore — clear client state regardless
        }
        startNavigationLoader();
        router.replace("/sign-in");
        router.refresh();
      }}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
