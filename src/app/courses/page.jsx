"use client";

import React, { useState } from "react";
import CourseCard from "@/components/catalog/CourseCard";
import FilterBar from "@/components/catalog/FilterBar";
import { mockCourses } from "@/data/mockCourses";
import { Terminal, ShieldCheck, Sparkles } from "lucide-react";

export default function CoursesCatalogPage() {
  const [courses] = useState(mockCourses);
  const [selectedTrack, setSelectedTrack] = useState("All Tracks");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesTrack =
      selectedTrack === "All Tracks" || course.track === selectedTrack;
    const matchesLevel =
      selectedLevel === "All Levels" || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>Auditable Engineering Labs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Proof of Work Cloud & DevOps Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Select an engineering objective. Deploy real infrastructure in your own AWS,
          Kubernetes, or Linux environments. Submit terminal outputs, pass sanity checks,
          and export your verifiable PDF dossier.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        selectedTrack={selectedTrack}
        onSelectTrack={setSelectedTrack}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id || course.slug} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">
            No engineering labs match your selected filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
