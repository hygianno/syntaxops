import React from "react";
import { AlertTriangle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CostWarningAlert({ message }) {
  if (!message) return null;

  const isCritical =
    message.toUpperCase().includes("CRITICAL") ||
    message.toUpperCase().includes("TEARDOWN");

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 rounded-[var(--radius-sm)] border my-4",
        isCritical
          ? "bg-[var(--error-subtle)] border-[var(--error-border)] text-[var(--error)]"
          : "bg-[var(--warning-subtle)] border-[var(--warning-border)] text-[var(--warning)]"
      )}
    >
      {isCritical
        ? <Flame className="w-4 h-4 shrink-0 mt-0.5" />
        : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      }
      <div className="text-[13px] leading-relaxed">
        <span className="font-semibold block mb-0.5 text-[12px] uppercase tracking-wide">
          {isCritical ? "Cost & Blast Radius Warning" : "Cloud Cost Notice"}
        </span>
        {message}
      </div>
    </div>
  );
}
