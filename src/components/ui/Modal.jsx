"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const widths = {
  sm:  "max-w-sm",
  md:  "max-w-lg",
  lg:  "max-w-2xl",
  xl:  "max-w-4xl",
  full:"max-w-full",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
  hideCloseButton = false,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    // Focus the panel
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full",
          widths[size],
          "bg-[var(--surface)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
          "p-6 focus:outline-none",
          className
        )}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between mb-4 gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 id="modal-title" className="text-[17px] font-semibold text-[var(--text-primary)] leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  "shrink-0 p-1.5 rounded-[6px]",
                  "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  "hover:bg-[var(--surface-2)]",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--border-strong)]"
                )}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
