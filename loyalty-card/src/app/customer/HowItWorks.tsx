const STEPS = [
  "Buy any drink",
  "Show your QR code",
  "Enjoy your free drink",
];

/**
 * The three-step explainer strip on a cream footer.
 * Figma has small illustrations here — text-only for now (see plan follow-ups).
 */
export function HowItWorks() {
  return (
    <div
      data-theme="cream"
      className="mt-auto flex items-start justify-between gap-2 bg-background px-6 py-7 text-center"
    >
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-start gap-2">
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span className="flex size-7 items-center justify-center rounded-full border border-line text-[13px] font-semibold text-foreground">
              {i + 1}
            </span>
            <span className="text-body-sm text-muted">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <span aria-hidden className="pt-1 text-muted">
              &rarr;
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
