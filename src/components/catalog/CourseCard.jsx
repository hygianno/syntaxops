import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight, Layers, FileCode } from "lucide-react";
import { formatCurrencyNGN, truncate } from "@/lib/utils";
import Button from "@/components/ui/Button";

const trackBadgeColors = {
  "Cloud & DevOps": "bg-cyan-950/60 text-cyan-400 border-cyan-800/60",
  "Full-Stack Web Dev": "bg-blue-950/60 text-blue-400 border-blue-800/60",
  "AI & Automation": "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
};

const levelBadgeColors = {
  Beginner: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50",
  Intermediate: "text-amber-400 bg-amber-950/40 border-amber-900/50",
  Advanced: "text-rose-400 bg-rose-950/40 border-rose-900/50",
};

export default function CourseCard({ course }) {
  const {
    slug,
    title,
    track,
    level,
    isPaid,
    priceNGN,
    summary,
    estimatedHours,
    steps = [],
  } = course;

  const trackColor =
    trackBadgeColors[track] || "bg-slate-800 text-slate-300 border-slate-700";
  const levelColor =
    levelBadgeColors[level] || "text-slate-400 bg-slate-900 border-slate-800";

  return (
    <div className="group relative flex flex-col justify-between bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20">
      <div>
        {/* Badges: Track, Level, Price */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${trackColor}`}
            >
              {track}
            </span>
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${levelColor}`}
            >
              {level}
            </span>
          </div>

          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
            {formatCurrencyNGN(priceNGN)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3">
          {summary}
        </p>

        {/* Meta Stats */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 pb-5 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{steps.length} Proof Steps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>~{estimatedHours}h execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verifiable PoW</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-500 font-mono">
          Ref: {slug.slice(0, 14)}...
        </div>
        <Link href={`/learn/${slug}`}>
          <Button
            size="sm"
            variant={isPaid ? "secondary" : "primary"}
            className="group/btn"
          >
            <span>{isPaid ? "Unlock Lab" : "Launch Lab"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
