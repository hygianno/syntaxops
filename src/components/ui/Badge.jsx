import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:  "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)]",
  primary:  "bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--brand-200)]",
  success:  "bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success-border)]",
  warning:  "bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning-border)]",
  error:    "bg-[var(--error-subtle)] text-[var(--error)] border-[var(--error-border)]",
};

const sizes = {
  sm: "text-[11px] px-1.5 py-0.5 gap-1",
  md: "text-[12px] px-2   py-0.5 gap-1.5",
  lg: "text-[13px] px-2.5 py-1   gap-1.5",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  icon: Icon,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
