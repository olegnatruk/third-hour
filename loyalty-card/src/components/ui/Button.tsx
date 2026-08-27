import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const base =
  "text-button inline-flex h-[52px] items-center justify-center rounded-[14px] px-6 " +
  "transition-opacity duration-150 active:opacity-80 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  // Fixed colors across both themes (Figma Button component).
  primary: "bg-[var(--btn-primary)] text-[var(--btn-primary-fg)]",
  secondary:
    "border border-[var(--btn-secondary-line)] bg-[var(--btn-secondary)] text-[var(--btn-secondary-fg)]",
  ghost: "text-foreground",
};

export function Button({
  variant = "primary",
  fullWidth = true,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
