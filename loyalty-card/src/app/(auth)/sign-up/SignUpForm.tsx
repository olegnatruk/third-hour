"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { SignUpResponse } from "@/lib/api/types";
import { Button, Icon, Input, LogoLockup, SectionHeading } from "@/components/ui";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.displayName.trim().length === 0) {
      setError("Please enter your name.");
      return;
    }
    if (form.password.length < 8 || form.password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    try {
      const result = await apiFetch<SignUpResponse>("/api/auth/sign-up", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
          displayName: form.displayName.trim(),
        },
      });

      if (result.requiresEmailConfirmation) {
        setNotice(
          "Check your inbox to confirm your email address, then sign in.",
        );
        setPending(false);
        return;
      }

      router.replace("/customer");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to create your account. Please try again.",
      );
      setPending(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex h-14 items-center px-5">
        <Link
          href="/sign-in"
          aria-label="Back to sign in"
          className="-ml-1 flex size-10 items-center justify-center text-foreground"
        >
          <Icon name="chevron-left" />
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center gap-[18px] px-7 pb-7 pt-4">
        <LogoLockup />
        <SectionHeading
          title="CREATE AN ACCOUNT"
          subtitle="Start your journey and earn stamps with every visit."
        />

        {notice ? (
          <div className="flex w-full flex-col gap-4">
            <p className="text-body text-foreground">{notice}</p>
            <Link
              href="/sign-in"
              className="text-button flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[var(--btn-secondary-line)] bg-[var(--btn-secondary)] px-6 text-[var(--btn-secondary-fg)]"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full flex-col gap-[18px]" noValidate>
            <Input
              label="Name"
              autoComplete="name"
              required
              value={form.displayName}
              onChange={(e) => set("displayName")(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => set("password")(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={(e) => set("confirm")(e.target.value)}
            />

            {error && (
              <p role="alert" className="text-body-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            {/* Cream screen: the filled action uses the dark (secondary) treatment. */}
            <Button type="submit" variant="secondary" disabled={pending}>
              {pending ? "Creating account…" : "Sign up"}
            </Button>

            <Link
              href="/sign-in"
              className="text-button text-center text-muted"
            >
              Already have an account? Sign in
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
