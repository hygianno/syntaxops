"use client";

import React from "react";
import { Filter } from "lucide-react";

export default function FilterBar({
  selectedTrack,
  onSelectTrack,
  selectedLevel,
  onSelectLevel,
  searchQuery,
  onSearchChange,
}) {
  const tracks = ["All Tracks", "Cloud & DevOps", "Full-Stack Web Dev", "AI & Automation"];
  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-8 backdrop-blur-sm">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search engineering labs (e.g. VPC, Canary, Docker)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Filter Badges / Selects */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Track Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTrack}
            onChange={(e) => onSelectTrack(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {tracks.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => onSelectLevel(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
