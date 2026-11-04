"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACKS = ["All tracks", "Cloud & DevOps", "Full-Stack Web Dev", "AI & Automation"];
const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];
const PRICING = ["All", "Free", "Paid"];

export default function FilterBar({
  searchQuery, onSearchChange,
  selectedTrack, onSelectTrack,
  selectedLevel, onSelectLevel,
  selectedPricing, onSelectPricing,
}) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="search"
          placeholder="Search labs — VPC, Kubernetes, Docker, CI/CD…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full h-10 pl-9 pr-4 rounded-[var(--radius-sm)]",
            "bg-[var(--surface)] border border-[var(--border)]",
            "text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
            "transition-colors duration-150"
          )}
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] shrink-0" />

        {/* Track */}
        <div className="flex flex-wrap gap-1.5">
          {TRACKS.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={selectedTrack === t}
              onClick={() => onSelectTrack(t)}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Level */}
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <FilterPill
              key={l}
              label={l}
              active={selectedLevel === l}
              onClick={() => onSelectLevel(l)}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* Pricing */}
        <div className="flex flex-wrap gap-1.5">
          {PRICING.map((p) => (
            <FilterPill
              key={p}
              label={p}
              active={selectedPricing === p}
              onClick={() => onSelectPricing(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-[13px] font-medium border transition-all duration-150",
        active
          ? "bg-[var(--accent)] text-white border-transparent shadow-sm"
          : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      )}
    >
      {label}
    </button>
  );
}
