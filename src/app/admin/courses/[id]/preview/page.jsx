"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, ShieldAlert, Edit, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import StepInstructionPane from "@/components/lab/StepInstructionPane";
import StudentNotebookPane from "@/components/lab/StudentNotebookPane";

export default function CoursePreviewPage({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Simulated student state for previewing
  const [previewState, setPreviewState] = useState({});
  const [mobileTab, setMobileTab] = useState("instructions");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
        }
      } catch (e) {
        console.error("Preview load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading || !course) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border)] border-t-[var(--accent)] mx-auto" />
          <p className="text-[13px] text-[var(--text-muted)]">Loading learner preview...</p>
        </div>
      </div>
    );
  }

  const steps = course.steps || [];
  const currentStep = steps[currentStepIndex] || null;
  const activeStepData = previewState[currentStep?.stepNumber] || {
    reflectionText: "",
    screenshotUrl: null,
    quizPassed: false,
  };

  const updatePreview = (updates) => {
    if (!currentStep) return;
    setPreviewState((prev) => ({
      ...prev,
      [currentStep.stepNumber]: {
        ...prev[currentStep.stepNumber],
        ...updates,
      },
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      {/* Admin Preview Watermark Banner */}
      <div className="bg-[var(--accent)] text-white text-[12px] font-semibold py-1.5 px-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>Learner Preview Mode — Inspecting: &quot;{course.title}&quot;</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/courses/${courseId}/edit`}>
            <span className="underline hover:opacity-90 flex items-center gap-1">
              <Edit className="w-3 h-3" /> Back to Editor
            </span>
          </Link>
          <Link href="/admin/courses">
            <span className="underline hover:opacity-90">Exit to Studio</span>
          </Link>
        </div>
      </div>

      {/* Workspace Top Toolbar */}
      <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/courses"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Studio</span>
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
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[8px] border border-[var(--border)]">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber || idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-all ${
                currentStepIndex === idx
                  ? "bg-[var(--accent)] text-white shadow-sm font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {currentStep ? (
          <>
            <div className="h-full overflow-hidden">
              <StepInstructionPane
                step={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
              />
            </div>

            <div className="h-full overflow-hidden bg-[var(--surface)]">
              <StudentNotebookPane
                step={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                reflectionText={activeStepData.reflectionText || ""}
                onReflectionChange={(val) => updatePreview({ reflectionText: val })}
                screenshotUrl={activeStepData.screenshotUrl || null}
                onScreenshotChange={(val) => updatePreview({ screenshotUrl: val })}
                quizPassed={!!activeStepData.quizPassed}
                onQuizPass={(passed) => updatePreview({ quizPassed: passed })}
                onNextStep={() => {
                  if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
                }}
                onPrevStep={() => {
                  if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
                }}
                onFinalizeLab={() => {
                  alert("Preview Mode: In live mode, this compiles your verified vector PDF dossier!");
                }}
                isSubmitting={false}
              />
            </div>
          </>
        ) : (
          <div className="col-span-2 flex items-center justify-center p-12 text-[14px] text-[var(--text-muted)]">
            No steps configured in this project.
          </div>
        )}
      </div>
    </div>
  );
}
