"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  Layers,
  BookOpen,
  Compass,
  FileText,
  Target,
  MessageSquareCode,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Coins,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import ProjectOverviewEditor from "@/components/admin/ProjectOverviewEditor";
import IntroductionEditor from "@/components/admin/IntroductionEditor";
import ArchitectureEditor from "@/components/admin/ArchitectureEditor";
import PrerequisitesEditor from "@/components/admin/PrerequisitesEditor";
import ObjectivesEditor from "@/components/admin/ObjectivesEditor";
import OpeningReflectionEditor from "@/components/admin/OpeningReflectionEditor";
import StepBuilder from "@/components/admin/StepBuilder";
import AssessmentEditor from "@/components/admin/AssessmentEditor";
import FinalReflectionEditor from "@/components/admin/FinalReflectionEditor";
import CourseValidationPanel, { evaluateCourseValidation } from "@/components/admin/CourseValidationPanel";

const SECTIONS = [
  { id: "overview", label: "Project Overview", icon: FileText },
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Compass },
  { id: "prerequisites", label: "Prerequisites", icon: CheckCircle },
  { id: "objectives", label: "Learning Objectives", icon: Target },
  { id: "opening-reflection", label: "Opening Reflection", icon: MessageSquareCode },
  { id: "steps", label: "Milestone Steps", icon: Layers },
  { id: "assessment", label: "Project Assessment", icon: ShieldCheck },
  { id: "final-reflection", label: "Final Reflection", icon: Award },
];

export default function CourseStudioLayout({ initialCourse, courseId }) {
  const router = useRouter();
  const addToast = useToast();

  const [course, setCourse] = useState(initialCourse);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Autosave status: 'saved' | 'saving' | 'unsaved' | 'error'
  const [saveStatus, setSaveStatus] = useState("saved");
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const isInitialMount = useRef(true);
  const autosaveTimeoutRef = useRef(null);

  // Core save function
  const persistCourse = useCallback(
    async (courseData, explicitStatus = null) => {
      setSaveStatus("saving");
      try {
        const payload = {
          ...courseData,
          ...(explicitStatus ? { status: explicitStatus } : {}),
        };

        const res = await fetch(`/api/admin/courses/${courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success && data.course) {
          setCourse(data.course);
          setSaveStatus("saved");
          setLastSavedTime(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          );
          return data.course;
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        console.error("Autosave error:", err);
        setSaveStatus("error");
      }
      return null;
    },
    [courseId]
  );

  // Debounced Autosave Trigger
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus("unsaved");

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      persistCourse(course);
    }, 1800);

    return () => {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    };
  }, [course, persistCourse]);

  // Publish handler
  const handlePublishToggle = async () => {
    const nextStatus = course.status === "published" ? "draft" : "published";

    if (nextStatus === "published") {
      const { isValidForPublish, issues } = evaluateCourseValidation(course);
      if (!isValidForPublish) {
        alert(
          `Cannot publish project yet. Please resolve ${issues.length} validation item(s):\n\n- ${issues
            .map((i) => i.label)
            .join("\n- ")}`
        );
        return;
      }
    }

    setIsPublishing(true);
    const updated = await persistCourse(course, nextStatus);
    setIsPublishing(false);

    if (updated) {
      if (addToast) {
        addToast({
          message:
            nextStatus === "published"
              ? "Project is now LIVE in the learner catalog!"
              : "Project reverted to draft mode.",
          type: "success",
        });
      }
    }
  };

  // Step Management
  const handleAddStep = () => {
    const steps = course.steps || [];
    const nextNumber = steps.length + 1;
    const newStep = {
      stepNumber: nextNumber,
      title: `Milestone ${nextNumber}: Deployment & Configuration`,
      objective: "Configure and verify infrastructure component.",
      estimatedMinutes: 30,
      isRequired: true,
      blocks: [
        {
          id: `b-${Date.now()}-1`,
          type: "rich-text",
          data: { content: "### Instructions\n\nExplain the procedure for this milestone." },
        },
        {
          id: `b-${Date.now()}-2`,
          type: "code",
          data: { language: "bash", code: "echo 'Verifying step...'", explanation: "Runs sanity check." },
        },
      ],
      promptQuestion: "What architectural trade-offs did you make in this step?",
      requiresScreenshot: true,
      quiz: {
        question: "Which component is responsible for this milestone's functionality?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answerIndex: 0,
        explanation: "Option A is the correct answer.",
      },
    };

    const updatedSteps = [...steps, newStep];
    setCourse({ ...course, steps: updatedSteps });
    setActiveSection("steps");
    setActiveStepIndex(updatedSteps.length - 1);
  };

  const handleDeleteStep = (index) => {
    if ((course.steps || []).length <= 1) {
      alert("A project must have at least one milestone step.");
      return;
    }
    const updatedSteps = (course.steps || [])
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    setCourse({ ...course, steps: updatedSteps });
    if (activeStepIndex >= updatedSteps.length) {
      setActiveStepIndex(Math.max(0, updatedSteps.length - 1));
    }
  };

  const handleDuplicateStep = (index) => {
    const target = course.steps[index];
    const clone = {
      ...target,
      title: `${target.title} (Copy)`,
    };
    const updatedSteps = [...(course.steps || [])];
    updatedSteps.splice(index + 1, 0, clone);
    const renumbered = updatedSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setCourse({ ...course, steps: renumbered });
    setActiveStepIndex(index + 1);
  };

  const currentStep = (course.steps || [])[activeStepIndex] || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      {/* ── Top Header Toolbar ──────────────────────────────── */}
      <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/courses"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Studio</span>
          </Link>
          <div className="h-4 w-px bg-[var(--border)] shrink-0" />
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-sm sm:max-w-md">
              {course.title || "Untitled Project"}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                course.status === "published"
                  ? "bg-[var(--success-subtle)] text-[var(--success)]"
                  : "bg-[var(--warning-subtle)] text-[var(--warning)]"
              }`}
            >
              {course.status || "draft"}
            </span>
          </div>
        </div>

        {/* Right actions: Save Status, Preview, Save Draft, Publish */}
        <div className="flex items-center gap-3">
          <div className="text-[12px] font-mono text-[var(--text-muted)] hidden sm:flex items-center gap-1.5">
            {saveStatus === "saving" && <span className="text-[var(--accent)] animate-pulse">Autosaving...</span>}
            {saveStatus === "saved" && (
              <span className="text-[var(--success)] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Saved {lastSavedTime ? `at ${lastSavedTime}` : ""}
              </span>
            )}
            {saveStatus === "unsaved" && <span className="text-[var(--warning)]">• Unsaved changes</span>}
            {saveStatus === "error" && <span className="text-[var(--error)]">Autosave failed</span>}
          </div>

          <Link href={`/admin/courses/${courseId}/preview`} target="_blank">
            <Button variant="ghost" size="sm" className="gap-1.5" title="Preview learner interface">
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => persistCourse(course)}
            isLoading={isManualSaving}
            className="gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishToggle}
            isLoading={isPublishing}
            className={course.status === "published" ? "bg-[var(--warning)] hover:bg-[var(--warning)]/90" : ""}
          >
            {course.status === "published" ? "Unpublish" : "Publish Project"}
          </Button>
        </div>
      </header>

      {/* ── Main Studio 3-Column Layout ─────────────────────── */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Project Structure Navigation */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-2">
              Project Structure
            </div>

            {SECTIONS.filter((s) => s.id !== "steps").map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-sm font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nested Milestone Steps */}
          <div className="space-y-1 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Milestones ({course.steps?.length || 0})
              </span>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-[var(--accent)] hover:underline text-[11px] font-bold flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            {(course.steps || []).map((st, idx) => {
              const isStepActive = activeSection === "steps" && activeStepIndex === idx;
              return (
                <button
                  key={st.stepNumber || idx}
                  onClick={() => {
                    setActiveSection("steps");
                    setActiveStepIndex(idx);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors text-left cursor-pointer ${
                    isStepActive
                      ? "bg-[var(--surface-3)] text-[var(--accent-text)] font-semibold border-l-2 border-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">#{idx + 1}</span>
                  <span className="truncate flex-1">{st.title || `Step ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Column: Active Section Editor */}
        <main className="col-span-12 md:col-span-6 lg:col-span-7 overflow-y-auto p-6 sm:p-8">
          {activeSection === "overview" && (
            <ProjectOverviewEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "introduction" && (
            <IntroductionEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "architecture" && (
            <ArchitectureEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "prerequisites" && (
            <PrerequisitesEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "objectives" && (
            <ObjectivesEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "opening-reflection" && (
            <OpeningReflectionEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "steps" && currentStep && (
            <StepBuilder
              step={currentStep}
              onChange={(updatedStep) => {
                const updated = [...(course.steps || [])];
                updated[activeStepIndex] = updatedStep;
                setCourse({ ...course, steps: updated });
              }}
              onDelete={() => handleDeleteStep(activeStepIndex)}
              onDuplicate={() => handleDuplicateStep(activeStepIndex)}
            />
          )}
          {activeSection === "assessment" && (
            <AssessmentEditor course={course} onChange={setCourse} />
          )}
          {activeSection === "final-reflection" && (
            <FinalReflectionEditor course={course} onChange={setCourse} />
          )}
        </main>

        {/* Right Column: Settings & Live Validation Panel */}
        <aside className="hidden lg:block lg:col-span-3 border-l border-[var(--border)] bg-[var(--surface)] overflow-y-auto p-5 space-y-6">
          {/* Quick Stats Pill */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Project Specification
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Discipline</span>
                <span className="font-medium text-[var(--text-primary)]">{course.track}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Difficulty</span>
                <span className="font-medium text-[var(--text-primary)]">{course.level}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Duration</span>
                <span className="font-medium text-[var(--text-primary)]">{course.estimatedDuration}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Course Price</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {course.isPaid ? `₦${course.priceNGN}` : "Free"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-muted)]">Build Cost</span>
                <span className="font-medium text-[var(--warning)]">
                  ${course.buildCost?.min ?? 0}–${course.buildCost?.max ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Checklist Panel */}
          <div className="pt-4 border-t border-[var(--border)]">
            <CourseValidationPanel course={course} />
          </div>

          {/* Preview Trigger Callout */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
            <div className="text-[12px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Learner Experience Preview</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Verify how your instructions, blocks, and reflection notebooks appear to learners before publishing.
            </p>
            <Link href={`/admin/courses/${courseId}/preview`} target="_blank" className="block pt-1">
              <Button variant="secondary" size="sm" className="w-full justify-center gap-1 text-[12px]">
                <span>Open Learner Preview</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
