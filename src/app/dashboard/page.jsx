"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Layers,
  Award,
  Sparkles,
  Flame,
  ExternalLink,
  ChevronRight,
  Compass,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { mockCourses } from "@/data/mockCourses";
import { formatCurrencyNGN } from "@/lib/utils";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [activeDrafts, setActiveDrafts] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("syntaxops:user_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      // Check for in-progress draft labs in localStorage
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
      setRecentSubmissions(subs);
    } catch (e) {
      console.error("Dashboard data load error:", e);
    }
  }, []);

  const featuredActive = activeDrafts.length > 0 ? activeDrafts[0] : {
    course: mockCourses[0],
    completedSteps: 0,
    totalSteps: mockCourses[0].steps.length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* ── Greeting & Overview Header ──────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
                {profile ? `Welcome back, ${profile.fullName.split(" ")[0]}` : "Learner Workspace"}
              </h1>
              <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                Your engineering execution progress, active drafts, and verified credentials.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/courses">
                <Button variant="secondary" size="md">
                  Browse All Labs
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Continue Learning Hero Card ─────────────────────── */}
          <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
              <Flame className="w-4 h-4 text-[var(--warning)]" />
              <span>Continue Learning</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                  <span className="px-2 py-0.5 rounded-full bg-[var(--surface-2)] font-medium text-[var(--text-secondary)]">
                    {featuredActive.course.track}
                  </span>
                  <span>•</span>
                  <span>{featuredActive.course.level}</span>
                </div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] leading-snug">
                  {featuredActive.course.title}
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-2xl line-clamp-2">
                  {featuredActive.course.summary}
                </p>

                {/* Progress bar */}
                <div className="pt-2 max-w-md">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1 font-medium">
                    <span>Milestone progress</span>
                    <span>
                      {featuredActive.completedSteps} of {featuredActive.totalSteps} completed
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((featuredActive.completedSteps / featuredActive.totalSteps) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex lg:justify-end">
                <Link href={`/learn/${featuredActive.course.slug}`}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                    <span>{featuredActive.completedSteps > 0 ? "Resume Lab" : "Start Lab"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Two Column Metrics & Activity ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Learning Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px] py-1 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Completed Labs</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {recentSubmissions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] py-1 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Active Drafts</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {activeDrafts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] py-1">
                  <span className="text-[var(--text-secondary)]">Verified Dossiers</span>
                  <span className="font-semibold text-[var(--success)]">
                    {recentSubmissions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Learning Focus */}
            <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-3 md:col-span-2">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
                Engineering Focus: Zero-Downtime Infrastructure
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Modern platform teams expect hands-on proficiency with VPC subnet topologies,
                least-privilege Security Groups, and progressive traffic rollouts.
                Complete the AWS VPC network lab to generate your first auditable dossier.
              </p>
              <div className="pt-1">
                <Link
                  href="/learn/production-aws-vpc-architecture"
                  className="text-[13px] font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  Jump to AWS VPC Lab <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Verified Credentials Showcase ──────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
                  Your Verified Credentials
                </h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Every lab completion issues an auditable HMAC proof identifier and PDF dossier.
                </p>
              </div>
            </div>

            {recentSubmissions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentSubmissions.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={`/portfolio/${sub.submissionId}`}
                    className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2">
                        <span className="font-mono text-[var(--accent-text)]">
                          {sub.verificationHash ? sub.verificationHash.slice(0, 16) : "VERIFIED"}...
                        </span>
                        <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Audited
                        </span>
                      </div>
                      <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
                        {sub.courseTitle}
                      </h3>
                      <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2">
                        {sub.userFullName} • Completed on{" "}
                        {new Date(sub.completedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)] text-[12px] text-[var(--accent)] font-medium flex items-center justify-between">
                      <span>View Proof Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)]">
                <Award className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
                  No verified credentials yet
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto mb-4">
                  Complete your first active lab to compile an auditable Proof of Work dossier.
                </p>
                <Link href="/courses">
                  <Button variant="secondary" size="sm">
                    Explore Free Labs
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
