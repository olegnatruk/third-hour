"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { RedeemResult, ScanAwardResult } from "@/lib/api/types";
import { AnimatedCheck } from "@/components/motion/AnimatedCheck";
import { CelebrationBurst } from "@/components/motion/CelebrationBurst";
import { listContainer, listItem, spring } from "@/components/motion/transitions";
import {
  Button,
  Icon,
  InfoNote,
  Input,
  ProgressRow,
  Segmented,
} from "@/components/ui";

type Mode = "award" | "redeem";

type Result =
  | { kind: "award"; data: ScanAwardResult }
  | { kind: "redeem"; data: RedeemResult };

const MODES = [
  { value: "award", label: "Award stamp" },
  { value: "redeem", label: "Redeem reward" },
] as const;

export function Scanner() {
  const [mode, setMode] = useState<Mode>("award");
  const [manualOpen, setManualOpen] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lockRef = useRef(false);

  const submitToken = useCallback(
    async (token: string) => {
      if (!token || lockRef.current) return;
      lockRef.current = true;
      setBusy(true);
      setError(null);
      try {
        if (mode === "award") {
          const { result } = await apiFetch<{ result: ScanAwardResult }>(
            "/api/qr/scan",
            { method: "POST", body: { token } },
          );
          setResult({ kind: "award", data: result });
        } else {
          const { result } = await apiFetch<{ result: RedeemResult }>(
            "/api/qr/redeem",
            { method: "POST", body: { token } },
          );
          setResult({ kind: "redeem", data: result });
        }
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "That code could not be processed.",
        );
        lockRef.current = false;
      } finally {
        setBusy(false);
      }
    },
    [mode],
  );

  // Start / stop the camera scanner while no result is shown.
  useEffect(() => {
    if (result) return;
    let cancelled = false;
    const reader = new BrowserQRCodeReader();

    (async () => {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current ?? undefined,
          (res) => {
            if (res && !cancelled) void submitToken(res.getText());
          },
        );
        if (cancelled) controls.stop();
        else controlsRef.current = controls;
      } catch {
        if (!cancelled) setCameraError(true);
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [result, submitToken]);

  function reset() {
    lockRef.current = false;
    setResult(null);
    setError(null);
    setManualToken("");
    setManualOpen(false);
  }

  if (result) {
    return <ScanResult result={result} onAgain={reset} />;
  }

  return (
    <div className="flex flex-col gap-4 px-7 pb-8">
      <div className="relative aspect-square w-full overflow-hidden rounded-[18px] border border-line bg-gradient-to-b from-[#201d1b] to-[#0b0a09]">
        <video
          ref={videoRef}
          className="size-full object-cover"
          muted
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex size-[62%] items-center justify-center rounded-[18px] border-2 border-dashed border-accent text-muted">
            {cameraError && <Icon name="camera" size={28} />}
          </div>
        </div>
      </div>

      <Segmented
        options={MODES}
        value={mode}
        onChange={(m) => setMode(m as Mode)}
      />

      <p className="text-center text-body text-muted">
        Point the camera at the customer&rsquo;s QR code.
      </p>

      {error && (
        <p role="alert" className="text-center text-body-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {manualOpen ? (
        <div className="flex flex-col gap-3">
          <Input
            label="Paste the customer's code"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
          />
          <Button
            variant="primary"
            disabled={busy || !manualToken.trim()}
            onClick={() => void submitToken(manualToken.trim())}
          >
            {busy ? "Submitting…" : "Submit code"}
          </Button>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setManualOpen(true)}>
          Enter code manually
        </Button>
      )}

      {cameraError && (
        <InfoNote>
          Camera access is required. Enable it in your browser settings, or enter
          the code manually.
        </InfoNote>
      )}
    </div>
  );
}

function ScanResult({
  result,
  onAgain,
}: {
  result: Result;
  onAgain: () => void;
}) {
  const isRedeem = result.kind === "redeem";
  const completed = !isRedeem && result.data.cardCompleted;
  const count = isRedeem ? 10 : result.data.awardedCardStampCount;
  const remaining = 10 - count;

  return (
    <m.div
      variants={listContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-4 px-7 pb-8 pt-4 text-center"
    >
      <div className="relative flex items-center justify-center">
        {!isRedeem && completed && <CelebrationBurst />}
        <m.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring}
          className="relative z-10 flex size-24 items-center justify-center rounded-full bg-success text-white"
        >
          <AnimatedCheck size={30} />
        </m.span>
      </div>

      <m.h2 variants={listItem} className="text-display text-foreground">
        {isRedeem
          ? "Reward redeemed"
          : completed
            ? "Card complete!"
            : "Stamp added"}
      </m.h2>
      <m.p variants={listItem} className="text-body text-muted">
        {isRedeem
          ? result.data.rewardName
          : result.data.idempotent
            ? "This code was already used — no extra stamp given."
            : "1 stamp added by you."}
      </m.p>

      {!isRedeem && (
        <m.div variants={listItem} className="w-full">
          <ProgressRow
            count={count}
            message={
              completed
                ? "A fresh card is ready at 0 / 10."
                : `${remaining} more ${remaining === 1 ? "stamp" : "stamps"} until this card is complete`
            }
          />
        </m.div>
      )}

      {!isRedeem && !completed && (
        <m.div variants={listItem} className="w-full">
          <InfoNote icon="gift" tone="accent" className="text-left">
            When the 10th stamp lands: &ldquo;Card complete — reward
            earned.&rdquo;
          </InfoNote>
        </m.div>
      )}

      <m.div variants={listItem} className="flex w-full flex-col gap-4">
        <Button variant="primary" onClick={onAgain}>
          Scan another
        </Button>
        <Button variant="ghost" onClick={onAgain}>
          Back to staff dashboard
        </Button>
      </m.div>
    </m.div>
  );
}
