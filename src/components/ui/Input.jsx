import React, { useId } from "react";
import { cn } from "@/lib/utils";

export default function Input({
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  type = "text",
  id: externalId,
  ...props
}) {
  const generatedId = useId();
  const id = externalId || generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[var(--text-primary)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={cn(
          "w-full h-9 px-3 rounded-[6px] text-[14px]",
          "bg-[var(--surface)] text-[var(--text-primary)]",
          "border transition-colors duration-150",
          "placeholder:text-[var(--text-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-[var(--error)] focus:ring-[var(--error)]/20"
            : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-[var(--error)] font-medium" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-[12px] text-[var(--text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  wrapperClassName,
  id: externalId,
  ...props
}) {
  const generatedId = useId();
  const id = externalId || generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[var(--text-primary)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full px-3 py-2.5 rounded-[6px] text-[14px]",
          "bg-[var(--surface)] text-[var(--text-primary)]",
          "border transition-colors duration-150",
          "placeholder:text-[var(--text-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "resize-none leading-relaxed",
          error
            ? "border-[var(--error)] focus:ring-[var(--error)]/20"
            : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-[var(--error)] font-medium" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-[12px] text-[var(--text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
