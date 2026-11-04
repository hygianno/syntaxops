"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText,
  ExternalLink,
  Flame,
  Award,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { mockCourses } from "@/data/mockCourses";

export default function MyLearningPage() {
  const [activeDrafts, setActiveDrafts] = useState([]);
  const [completedLabs, setCompletedLabs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    try {
      const drafts = [];
      const subs = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("syntaxops:draft:")) {
          const courseSlug = key.replace("syntaxops:draft:", "");
          const matchingCourse = mockCourses.find((c) => c.slug === courseSlug);
          if (matchingCourse) {
            const rawDraft = localStorage.getItem(key);
            try {
              const draftData = JSON.parse(rawDraft);
              const completedCount = Object.values(draftData).filter(
                (s) => s.quizPassed && (s.reflectionText?.trim().split(/\s+/).filter(Boolean).length >= 20)
              ).length;
              drafts.push({
                course: matchingCourse,
                completedSteps: completedCount,
                totalSteps: matchingCourse.steps.length,
              });
            } catch (e) {}
          }
        } else if (key && key.startsWith("syntaxops:submission:")) {
          try {
            const sub = JSON.parse(localStorage.getItem(key));
            subs.push(sub);
          } catch (e) {}
        }
      }
      setActiveDrafts(drafts);
      setCompletedLabs(subs);
    } catch (e) {
      console.error("MyLearning load error:", e);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-[var(--border)]">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
              My Learning
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Track your hands-on cloud labs, in-progress drafts, and verified credentials.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
            {[
              { id: "all", label: "All Projects" },
              { id: "in-progress", label: `In Progress (${activeDrafts.length})` },
              { id: "completed", label: `Completed (${completedLabs.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--surface-2)] text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section: In Progress Labs */}
          {(activeTab === "all" || activeTab === "in-progress") && (
            <section className="space-y-4">
              <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                Active In-Progress Labs
              </h2>

              {activeDrafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDrafts.map(({ course, completedSteps, totalSteps }) => (
                    <div
                      key={course.slug}
                      className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--surface-2)] font-medium text-[var(--text-secondary)]">
                          {course.track}
                        </span>
                        <span>{course.level}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                        {course.title}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">
                        {course.summary}
                      </p>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
                          <span>Milestone progress</span>
                          <span>
                            {completedSteps}/{totalSteps} complete
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent)] rounded-full"
                            style={{
                              width: `${Math.max(10, Math.round((completedSteps / totalSteps) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link href={`/learn/${course.slug}`}>
                          <Button variant="primary" size="sm" className="gap-1.5">
                            <span>Resume Execution</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[var(--text-muted)] italic">
                  No labs currently in draft state. Choose an engineering lab from the catalog to begin.
                </p>
              )}
            </section>
          )}

          {/* Section: Completed Labs */}
          {(activeTab === "all" || activeTab === "completed") && (
            <section className="space-y-4 pt-4">
              <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                Completed & Verified Projects
              </h2>

              {completedLabs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedLabs.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[var(--accent-text)]">
                          {sub.verificationHash ? sub.verificationHash.slice(0, 16) : "VERIFIED"}...
                        </span>
                        <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Audited
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                        {sub.courseTitle}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)]">
                        Verified for <span className="font-medium text-[var(--text-primary)]">{sub.userFullName}</span>
                      </p>

                      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                        <Link
                          href={`/portfolio/${sub.submissionId}`}
                          className="text-[13px] font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Proof Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)]">
                  <p className="text-[13px] text-[var(--text-muted)]">
                    You haven’t completed any labs yet.
                  </p>
                  <Link href="/courses" className="mt-3 inline-block">
                    <Button variant="secondary" size="sm">
                      Browse Active Curriculum
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
