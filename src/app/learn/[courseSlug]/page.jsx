"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal,
  Shield,
  ArrowLeft,
  Layers,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { mockCourses } from "@/data/mockCourses";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import StepInstructionPane from "@/components/lab/StepInstructionPane";
import StudentNotebookPane from "@/components/lab/StudentNotebookPane";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LearnWorkspacePage({ params }) {
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.courseSlug;
  const router = useRouter();

  // Find course definition (fallback to first course if slug not matched)
  const course =
    mockCourses.find((c) => c.slug === courseSlug) || mockCourses[0];

  const totalSteps = course.steps.length;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = course.steps[currentStepIndex];

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
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
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
          track: course.track,
          level: course.level,
        };
        localStorage.setItem(
          `syntaxops:submission:${data.submissionId}`,
          JSON.stringify(portfolioPayload)
        );

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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Workspace Top Toolbar */}
      <div className="h-12 bg-slate-950 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Catalog</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        {/* Milestone Steps Stepper */}
        <div className="flex items-center gap-1.5">
          {course.steps.map((s, idx) => {
            const isCompleted =
              idx < currentStepIndex ||
              (labState[s.stepNumber]?.quizPassed &&
                labState[s.stepNumber]?.reflectionText?.trim().split(/\s+/).filter(Boolean).length >= 20);

            return (
              <button
                key={s.stepNumber}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-7 h-7 rounded-md text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                    : isCompleted
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {isCompleted && currentStepIndex !== idx ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  idx + 1
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Pane: Architecture Specs & Step Instructions */}
        <StepInstructionPane
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />

        {/* Right Pane: Student Notebook & Proof Submissions */}
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
        />
      </div>

      {/* User Profile Binding Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Bind Your Engineer Profile"
        description="To compile a valid Proof of Work report, please provide your legal name and email."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Legal Name"
            placeholder="e.g. Folarin Favour Olaoluwapo"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
            helperText="Appears on official verified completion certificates"
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
          <div className="pt-2 flex justify-end gap-3">
            <Button type="submit" variant="primary">
              Confirm & Start Lab
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
