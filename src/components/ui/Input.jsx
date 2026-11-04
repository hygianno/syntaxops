import React from "react";
import { cn } from "@/lib/utils";

export default function Input({
  label,
  error,
  helperText,
  className,
  id,
  type = "text",
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={cn(
          "w-full px-3.5 py-2.5 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-1",
          error
            ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30"
            : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/30",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
