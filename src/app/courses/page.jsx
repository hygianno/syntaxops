"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/catalog/CourseCard";
import FilterBar from "@/components/catalog/FilterBar";
import { mockCourses } from "@/data/mockCourses";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";

export default function CoursesCatalogPage() {
  const [selectedTrack, setSelectedTrack] = useState("All tracks");
  const [selectedLevel, setSelectedLevel] = useState("All levels");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockCourses.filter((c) => {
    const matchTrack  = selectedTrack   === "All tracks"  || c.track  === selectedTrack;
    const matchLevel  = selectedLevel   === "All levels"  || c.level  === selectedLevel;
    const matchPrice  = selectedPricing === "All"
      ? true
      : selectedPricing === "Free" ? !c.isPaid : c.isPaid;
    const matchSearch = !searchQuery || [c.title, c.summary, c.track]
      .some((s) => s?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTrack && matchLevel && matchPrice && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-14">
        {/* Page header */}
        <div className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
              Engineering Lab Catalog
            </h1>
            <p className="text-[15px] text-[var(--text-secondary)] max-w-2xl">
              Choose a real-world engineering project. Build it in your own environment.
              Submit verified proof. Export your dossier.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTrack={selectedTrack}
              onSelectTrack={setSelectedTrack}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              selectedPricing={selectedPricing}
              onSelectPricing={setSelectedPricing}
            />
          </div>

          {/* Results count */}
          <div className="mb-5 text-[13px] text-[var(--text-muted)]">
            {filtered.length} lab{filtered.length !== 1 ? "s" : ""} found
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c) => (
                <CourseCard key={c._id || c.slug} course={c} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">No labs match your filters</p>
              <p className="text-[13px] text-[var(--text-muted)]">Try adjusting your track, level, or search query.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
