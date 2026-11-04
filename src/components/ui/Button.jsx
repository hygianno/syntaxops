import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: [
    "bg-[var(--accent)] text-white",
    "hover:bg-[var(--accent-hover)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "shadow-sm",
  ],
  secondary: [
    "bg-[var(--surface-2)] text-[var(--text-primary)]",
    "border border-[var(--border)]",
    "hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  ghost: [
    "bg-transparent text-[var(--text-secondary)]",
    "hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--border-strong)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  destructive: [
    "bg-[var(--error-subtle)] text-[var(--error)]",
    "border border-[var(--error-border)]",
    "hover:bg-[var(--error)] hover:text-white",
    "focus-visible:ring-2 focus-visible:ring-[var(--error)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  link: [
    "bg-transparent text-[var(--accent)] underline-offset-4",
    "hover:underline",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "p-0 h-auto",
  ],
};

const sizes = {
  sm:   "h-8  px-3   text-[13px] gap-1.5 rounded-[6px]",
  md:   "h-9  px-4   text-[14px] gap-2   rounded-[6px]",
  lg:   "h-10 px-5   text-[15px] gap-2   rounded-[8px]",
  xl:   "h-12 px-6   text-[16px] gap-2.5 rounded-[10px]",
  icon: "h-9  w-9    text-[14px]         rounded-[6px] p-0 justify-center",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  isLoading = false,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150 ease-in-out",
        "select-none cursor-pointer whitespace-nowrap",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        variant !== "link" && size !== "icon" && "leading-none",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="w-4 h-4 shrink-0" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner({ className }) {
  return (
    <svg
      className={cn("animate-spin text-current", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
