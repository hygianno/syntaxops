"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CodeBlock({ code, language = "bash" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="my-4 rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)]">
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-medium px-2 py-1 rounded-[4px]",
            "transition-all duration-150",
            copied
              ? "text-[var(--success)] bg-[var(--success-subtle)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
          )}
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" />Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" />Copy</>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 bg-[var(--surface)] overflow-x-auto">
        <code className="text-[13px] font-mono text-[var(--accent-text)] leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
