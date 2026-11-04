"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  FileCheck2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  DollarSign,
  Info,
} from "lucide-react";
import { mockCourses } from "@/data/mockCourses";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import StepInstructionPane from "@/components/lab/StepInstructionPane";
import StudentNotebookPane from "@/components/lab/StudentNotebookPane";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function LearnWorkspacePage({ params }) {
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.courseSlug;
  const router = useRouter();
  const addToast = useToast();

  // Find course definition (fallback to mock course initially for zero-delay offline experience)
  const initialMockCourse =
    mockCourses.find((c) => c.slug === courseSlug) || mockCourses[0];

  const [course, setCourse] = useState(initialMockCourse);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  // Fetch published course dynamically from database/API
  useEffect(() => {
    let isMounted = true;
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.course && data.course.steps?.length > 0) {
            if (isMounted) {
              setCourse(data.course);
            }
          }
        }
      } catch (err) {
        console.warn("Using offline/fallback course data:", err);
      } finally {
        if (isMounted) setIsLoadingCourse(false);
      }
    }
    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [courseSlug]);

  const totalSteps = course.steps?.length || 1;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = course.steps?.[currentStepIndex] || course.steps?.[0] || {};

  // Mobile / responsive view toggle: 'instructions' or 'notebook'
  const [mobileTab, setMobileTab] = useState("instructions");

  // User Profile
  const [userProfile, setUserProfile] = useLocalStorage(
    "syntaxops:user_profile",
    null
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  // Persistent lab notebook responses state
  const [labState, setLabState] = useLocalStorage(
    `syntaxops:draft:${course.slug}`,
    {}
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active step responses
  const activeStepData = labState[currentStep.stepNumber] || {
    reflectionText: "",
    screenshotUrl: null,
    quizPassed: false,
  };

  useEffect(() => {
    // If user has not configured profile, prompt once on load
    if (!userProfile) {
      setIsProfileModalOpen(true);
    } else {
      setProfileName(userProfile.fullName || "");
      setProfileEmail(userProfile.email || "");
    }
  }, [userProfile]);

  const updateActiveStep = (updates) => {
    setLabState((prev) => ({
      ...prev,
      [currentStep.stepNumber]: {
        ...prev[currentStep.stepNumber],
        ...updates,
      },
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) return;

    const newProfile = {
      fullName: profileName.trim(),
      email: profileEmail.trim().toLowerCase(),
    };
    setUserProfile(newProfile);
    setIsProfileModalOpen(false);
    if (addToast) {
      addToast({ message: "Engineer profile bound successfully.", type: "success" });
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setMobileTab("instructions");
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setMobileTab("instructions");
    }
  };

  const handleFinalizeLab = async () => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Assemble all responses
      const stepResponses = course.steps.map((step) => {
        const stepData = labState[step.stepNumber] || {};
        return {
          stepNumber: step.stepNumber,
          title: step.title,
          reflectionText: stepData.reflectionText || "",
          screenshotUrl: stepData.screenshotUrl || null,
          quizPassed: !!stepData.quizPassed,
        };
      });

      const payload = {
        userEmail: userProfile.email,
        userFullName: userProfile.fullName,
        courseSlug: course.slug,
        courseTitle: course.title,
        stepResponses,
        courseProblemStatement: course.problemStatement || "",
        architectureDiagramUrl: course.architecture?.diagramUrl || null,
        openingReflection: labState["openingReflection"] || null,
        finalReflection: labState["finalReflection"] || null,
      };

      const res = await fetch("/api/submissions/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Store full completed submission in localStorage for client-side PDF viewer
        const portfolioPayload = {
          ...data,
          stepResponses,
          courseSummary: course.summary,
          courseProblemStatement: course.problemStatement || "",
          architectureDiagramUrl: course.architecture?.diagramUrl || null,
          track: course.track,
          level: course.level,
        };
        localStorage.setItem(
          `syntaxops:submission:${data.submissionId}`,
          JSON.stringify(portfolioPayload)
        );

        if (addToast) {
          addToast({ message: "Lab finalized! Compiling verification dossier...", type: "success" });
        }
        router.push(`/portfolio/${data.submissionId}`);
      } else {
        alert("Lab finalization failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Lab finalization error:", err);
      alert("Submission encountered an unexpected error. Check console logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress metrics
  const completedStepsCount = (course.steps || []).filter((s) => {
    const sData = labState[s.stepNumber];
    const words = sData?.reflectionText ? sData.reflectionText.trim().split(/\s+/).filter(Boolean).length : 0;
    return sData?.quizPassed && words >= 20;
  }).length;
  const progressPercent = Math.round((completedStepsCount / totalSteps) * 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      {/* ── Top Workspace Bar ───────────────────────────────── */}
      <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
        {/* Left: Back + Project Info */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Catalog</span>
          </Link>
          <div className="h-4 w-px bg-[var(--border)] shrink-0" />
          <div className="min-w-0">
            <h1 className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <span>{course.track}</span>
              <span>•</span>
              <span className="text-[var(--accent-text)] font-medium">
                {progressPercent}% Complete ({completedStepsCount}/{totalSteps} milestones)
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Stepper Navigation & Project Context */}
        <div className="flex items-center gap-2">
          {/* Architecture & Specs button */}
          {(course.architecture?.diagramUrl || course.problemStatement || course.buildCost) && (
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[12px] text-[var(--text-secondary)] font-medium transition-colors"
              title="View Architecture & System Specifications"
            >
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="hidden md:inline">Architecture & Specs</span>
            </button>
          )}

          {/* Step Pill Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[8px] border border-[var(--border)]" aria-label="Milestone Progress">
            {course.steps?.map((s, idx) => {
              const sData = labState[s.stepNumber];
              const words = sData?.reflectionText ? sData.reflectionText.trim().split(/\s+/).filter(Boolean).length : 0;
              const isStepDone = sData?.quizPassed && words >= 20;
              const isActive = currentStepIndex === idx;

              return (
                <button
                  key={s.stepNumber || idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-sm font-semibold"
                      : isStepDone
                      ? "text-[var(--success)] hover:bg-[var(--surface-3)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isStepDone ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <span className="truncate max-w-[100px] hidden lg:inline">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User profile identifier / quick switch */}
          {userProfile && (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[12px] text-[var(--text-secondary)] font-medium transition-colors"
              title="Click to edit profile"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <span className="max-w-[100px] truncate">{userProfile.fullName}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Mobile Tab Switcher (Visible on < lg screens) ────── */}
      <div className="lg:hidden shrink-0 border-b border-[var(--border)] bg-[var(--surface-2)] flex">
        <button
          onClick={() => setMobileTab("instructions")}
          className={`flex-1 py-2.5 text-[13px] font-medium border-b-2 text-center transition-colors ${
            mobileTab === "instructions"
              ? "border-[var(--accent)] text-[var(--accent-text)] bg-[var(--surface)] font-semibold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          1. Instructions
        </button>
        <button
          onClick={() => setMobileTab("notebook")}
          className={`flex-1 py-2.5 text-[13px] font-medium border-b-2 text-center transition-colors ${
            mobileTab === "notebook"
              ? "border-[var(--accent)] text-[var(--accent-text)] bg-[var(--surface)] font-semibold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          2. Learner Notebook
        </button>
      </div>

      {/* ── Main Workspace Body (Dual-Pane) ─────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Pane: Instructions */}
        <div className={`h-full overflow-hidden ${mobileTab === "instructions" ? "block" : "hidden lg:block"}`}>
          <StepInstructionPane
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
          />
        </div>

        {/* Right Pane: Learner Notebook */}
        <div className={`h-full overflow-hidden bg-[var(--surface)] ${mobileTab === "notebook" ? "block" : "hidden lg:block"}`}>
          <StudentNotebookPane
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            reflectionText={activeStepData.reflectionText || ""}
            onReflectionChange={(val) => updateActiveStep({ reflectionText: val })}
            screenshotUrl={activeStepData.screenshotUrl || null}
            onScreenshotChange={(val) => updateActiveStep({ screenshotUrl: val })}
            quizPassed={!!activeStepData.quizPassed}
            onQuizPass={(passed) => updateActiveStep({ quizPassed: passed })}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onFinalizeLab={handleFinalizeLab}
            isSubmitting={isSubmitting}
            courseSlug={course.slug}
          />
        </div>
      </div>

      {/* ── Architecture & Project Specs Modal ──────────────── */}
      <Modal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        title="Production Architecture & System Specifications"
        description={course.title}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {course.problemStatement && (
            <div className="p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Problem Statement & Real-World Context
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {course.problemStatement}
              </p>
            </div>
          )}

          {course.architecture?.diagramUrl && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                System Topology & Infrastructure Diagram
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.architecture.diagramUrl}
                alt="System Architecture"
                className="w-full rounded-[6px] border border-[var(--border)] max-h-80 object-contain bg-[var(--surface-3)]"
              />
            </div>
          )}

          {course.architecture?.dataFlow && (
            <div className="p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Data Flow & Ingress Path
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {course.architecture.dataFlow}
              </p>
            </div>
          )}

          {course.buildCost && (
            <div className="flex items-center gap-2 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)] text-[12px] text-[var(--text-secondary)]">
              <DollarSign className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span><strong>Estimated Infrastructure Cost:</strong> {course.buildCost}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* ── User Profile Binding Modal ──────────────────────── */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Engineer Identity Binding"
        description="To generate an authentic, verifiable Proof of Work dossier, your name and email are bound to your project execution artifacts."
        size="sm"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
          <Input
            label="Full Legal / Engineering Name"
            placeholder="e.g. Folarin Favour Olaoluwapo"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
            helperText="Printed on official verified completion certificates"
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. folarin@example.com"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            required
            helperText="Used for unique cryptographic hash verification"
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Confirm Engineer Identity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
