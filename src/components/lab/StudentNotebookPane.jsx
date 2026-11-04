"use client";

import React, { useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SanityQuiz from "@/components/lab/SanityQuiz";

export default function StudentNotebookPane({
  step,
  currentStepIndex,
  totalSteps,
  reflectionText,
  onReflectionChange,
  screenshotUrl,
  onScreenshotChange,
  quizPassed,
  onQuizPass,
  onNextStep,
  onPrevStep,
  onFinalizeLab,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  // Word count validation: requires minimum 20 words for conceptual proof
  const wordCount = reflectionText
    ? reflectionText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const isWordCountValid = wordCount >= 20;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an evidentiary image (.png, .jpg, .jpeg)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (typeof base64Data === "string") {
        onScreenshotChange(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    onScreenshotChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enforced gating rule: Learner cannot proceed without reflection, quiz, and screenshot
  const isMilestoneSatisfied =
    isWordCountValid &&
    quizPassed &&
    (!step.requiresScreenshot || !!screenshotUrl);

  const isFinalStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="h-full flex flex-col bg-slate-900/60 overflow-y-auto p-6 space-y-6">
      {/* Pane Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <FileText className="w-4 h-4" />
            <span>Evidentiary Notebook & Proof of Work</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Auto-Saving to Local Draft
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Articulate architectural reasoning, pass sanity verification, and submit
          terminal output proofs before unlocking the next milestone.
        </p>
      </div>

      {/* Conceptual Reflection Prompt */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-200">
          1. Conceptual Discovery Analysis
          <span className="text-rose-400 ml-1">*</span>
        </label>
        <p className="text-xs text-cyan-300/90 font-mono bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40">
          &gt; {step.promptQuestion}
        </p>

        <div className="relative">
          <textarea
            rows={5}
            value={reflectionText}
            onChange={(e) => onReflectionChange(e.target.value)}
            placeholder="Type your architectural rationale and observations here... (Minimum 20 words required to demonstrate cognitive synthesis)"
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span
              className={
                isWordCountValid
                  ? "text-emerald-400 flex items-center gap-1 font-medium"
                  : "text-slate-500"
              }
            >
              {isWordCountValid && <CheckCircle className="w-3.5 h-3.5" />}
              {wordCount} / 20 words minimum
            </span>
            {!isWordCountValid && (
              <span className="text-amber-400/80">
                {20 - wordCount} more words required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Terminal / Screenshot Proof Upload Dropzone */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-200">
          2. Evidentiary Terminal / Console Screenshot
          {step.requiresScreenshot && <span className="text-rose-400 ml-1">*</span>}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {screenshotUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-2">
            <div className="flex items-center justify-between pb-2 px-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Terminal Proof Attached
              </span>
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Terminal execution proof"
              className="w-full max-h-56 object-contain rounded bg-black/40 border border-slate-800"
            />
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-6 text-center bg-slate-950/40 hover:bg-slate-950 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-300">
              Click to attach terminal or cloud console screenshot
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports PNG, JPG, or WEBP up to 5MB (Base64 vector-embedded)
            </p>
          </div>
        )}
      </div>

      {/* Conceptual Sanity Quiz Gate */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-200">
          3. Sanity Verification Gate
          <span className="text-rose-400 ml-1">*</span>
        </label>
        <SanityQuiz
          quiz={step.quiz}
          onPass={onQuizPass}
          isPassed={quizPassed}
        />
      </div>

      {/* Navigation & Submission Action Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentStepIndex === 0}
          onClick={onPrevStep}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Previous</span>
        </Button>

        {isFinalStep ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!isMilestoneSatisfied || isSubmitting}
            isLoading={isSubmitting}
            onClick={onFinalizeLab}
            className="shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-400 text-slate-950"
          >
            <FileCheck className="w-4 h-4 mr-1.5" />
            <span>Finalize & Compile PDF Dossier</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!isMilestoneSatisfied}
            onClick={onNextStep}
          >
            <span>Next Milestone</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>

      {!isMilestoneSatisfied && (
        <p className="text-[11px] text-amber-400/90 text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Complete 20+ words reflection, pass sanity quiz, and upload screenshot to unlock progression.
        </p>
      )}
    </div>
  );
}
