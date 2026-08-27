"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Visible placeholder text; also used as the accessible label. */
  label?: string;
  /** Error message shown under the field; also flips the border to danger. */
  error?: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  wrapperClassName?: string;
};

export function Input({
  label,
  error,
  type = "text",
  id,
  placeholder,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && reveal ? "text" : type;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      <div
        className={cn(
          "flex h-14 items-center gap-2.5 overflow-hidden rounded-[14px] border bg-field pl-[18px] pr-4",
          error ? "border-[var(--danger)]" : "border-line",
        )}
      >
        <input
          id={inputId}
          type={resolvedType}
          placeholder={placeholder ?? label}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-muted",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="shrink-0 text-muted transition-colors hover:text-foreground"
          >
            <Icon name="eye" size={20} />
          </button>
        )}
      </div>
      {error && <p className="text-body-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
}
