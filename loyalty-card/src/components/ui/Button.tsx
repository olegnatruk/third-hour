"use client";

import type { ButtonHTMLAttributes } from "react";
import { m } from "motion/react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const base =
  "text-button inline-flex h-[52px] items-center justify-center rounded-[14px] px-6 " +
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
  disabled,
  ...props
}: ButtonProps) {
  return (
    <m.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
