import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Layers, ShieldCheck } from "lucide-react";
import { cn, formatCurrencyNGN } from "@/lib/utils";

const TRACK_STYLES = {
  "Cloud & DevOps":    "text-blue-400   bg-blue-500/10  border-blue-500/20",
  "Full-Stack Web Dev":"text-violet-400 bg-violet-500/10 border-violet-500/20",
  "AI & Automation":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const LEVEL_STYLES = {
  Beginner:     "text-[var(--success)] bg-[var(--success-subtle)]",
  Intermediate: "text-[var(--warning)] bg-[var(--warning-subtle)]",
  Advanced:     "text-[var(--error)]   bg-[var(--error-subtle)]",
};

export default function CourseCard({ course }) {
  const {
    slug, title, track, level, isPaid, priceNGN,
    summary, estimatedHours, steps = [],
  } = course;

  const trackStyle = TRACK_STYLES[track] || "text-[var(--text-muted)] bg-[var(--surface-2)] border-[var(--border)]";
  const levelStyle = LEVEL_STYLES[level] || "text-[var(--text-muted)] bg-[var(--surface-2)]";

  return (
    <article className="group flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200">
      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Row 1: badges + price */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border", trackStyle)}>
            {track}
          </span>
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", levelStyle)}>
            {level}
          </span>
          <span className="ml-auto text-[13px] font-semibold text-[var(--text-secondary)]">
            {formatCurrencyNGN(priceNGN)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] leading-snug mb-2 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1 mb-5">
          {summary}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            {steps.length} steps
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            ~{estimatedHours}h
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
            Verified PoW
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface-2)] rounded-b-[var(--radius-md)]">
        <Link
          href={`/learn/${slug}`}
          className="flex items-center justify-between text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group/link"
        >
          <span className="text-[var(--accent)] font-semibold">
            {isPaid ? "Unlock lab" : "Launch free lab"}
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
