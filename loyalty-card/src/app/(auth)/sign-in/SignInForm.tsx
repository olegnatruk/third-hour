"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { SessionUser } from "@/lib/api/types";
import { homePathForRole } from "@/lib/auth/roles";
import { startNavigationLoader } from "@/components/motion/navigationLoading";
import { Button, Input, LogoLockup, SectionHeading } from "@/components/ui";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await apiFetch("/api/auth/sign-in", {
        method: "POST",
        body: { email, password },
      });
      const { user } = await apiFetch<{ user: SessionUser }>("/api/auth/me");
      startNavigationLoader();
      router.replace(homePathForRole(user.role));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to sign in. Please try again.",
      );
      setPending(false);
    }
  }

  return (
    <main
      className="flex flex-1 flex-col items-center gap-4 px-7 pb-10 pt-24"
      style={{
        background:
          "linear-gradient(to bottom, #292421 0%, #0f0d0c 55%, #0f0d0c 100%)",
      }}
    >
      <LogoLockup />

      <div className="min-h-4 flex-1" />

      <SectionHeading
        title="WELCOME BACK"
        subtitle="Log in to continue earning stamps at Third Hour Cafe."
      />

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-body-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowForgot((v) => !v)}
        >
          Forgot password?
        </Button>
        {showForgot && (
          <p className="-mt-2 text-center text-body-sm text-muted">
            Password recovery isn&rsquo;t available yet — please ask Third Hour
            staff to help.
          </p>
        )}

        <div className="h-1" />

        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <Link
        href="/sign-up"
        className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[var(--btn-secondary-line)] bg-[var(--btn-secondary)] px-6 text-[var(--btn-secondary-fg)] transition-opacity active:opacity-80"
      >
        Sign up
      </Link>
    </main>
  );
}
