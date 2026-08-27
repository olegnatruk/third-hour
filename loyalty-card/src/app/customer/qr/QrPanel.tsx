"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { QrTokenResponse } from "@/lib/api/types";
import { Button, QRDisplay, type QrState } from "@/components/ui";

type TokenState = {
  dataUrl: string;
  expiresAt: number;
};

function formatCountdown(msLeft: number): string {
  const total = Math.max(0, Math.ceil(msLeft / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QrPanel() {
  const [token, setToken] = useState<TokenState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autoRefreshedFor = useRef<number>(0);

  const refresh = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      const res = await apiFetch<QrTokenResponse>("/api/loyalty-card/qr", {
        method: "POST",
      });
      const dataUrl = await QRCode.toDataURL(res.token, {
        margin: 0,
        width: 360,
        color: { dark: "#0f0d0c", light: "#ffffff" },
      });
      setToken({ dataUrl, expiresAt: new Date(res.expiresAt).getTime() });
      setNow(Date.now());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to create a QR code. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    // Issue the first code on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const msLeft = token ? token.expiresAt - now : 0;

  // Auto-issue a fresh code shortly after the current one lapses.
  useEffect(() => {
    if (!token || pending) return;
    if (msLeft <= 0 && autoRefreshedFor.current !== token.expiresAt) {
      autoRefreshedFor.current = token.expiresAt;
      const id = window.setTimeout(() => void refresh(), 1500);
      return () => window.clearTimeout(id);
    }
  }, [token, msLeft, pending, refresh]);

  let state: QrState = "active";
  if (token && msLeft <= 0) state = "expired";
  else if (token && msLeft <= 10_000) state = "expiring";

  return (
    <div className="flex flex-col items-center gap-4 px-7">
      <p className="text-body text-muted">Show this code to the Third Hour staff.</p>

      <QRDisplay
        state={state}
        countdown={token ? formatCountdown(msLeft) : "—"}
        qr={
          token ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={token.dataUrl} alt="Your loyalty QR code" />
          ) : null
        }
      />

      {error && (
        <p role="alert" className="text-body-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <Button variant="secondary" onClick={() => void refresh()} disabled={pending}>
        {pending ? "Refreshing…" : "Refresh code"}
      </Button>

      <p className="text-body-sm text-muted">
        Your code contains no personal details.
      </p>
      <div className="mt-2 h-px w-full bg-line" />
    </div>
  );
}
