import React from "react";
import { AlertTriangle } from "lucide-react";

export default function CostWarningAlert({ message }) {
  if (!message) return null;

  const isCritical =
    message.toUpperCase().includes("CRITICAL") ||
    message.toUpperCase().includes("TEARDOWN");

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg border my-4 text-xs leading-relaxed ${
        isCritical
          ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
          : "bg-amber-950/40 border-amber-800/80 text-amber-200"
      }`}
    >
      <AlertTriangle
        className={`w-4 h-4 shrink-0 mt-0.5 ${
          isCritical ? "text-rose-400" : "text-amber-400"
        }`}
      />
      <div>
        <span className="font-semibold uppercase tracking-wider block mb-0.5 text-[10px]">
          {isCritical ? "Cost & Blast Radius Hazard" : "Cloud Cost Advisory"}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}
