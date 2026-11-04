"use client";

import React, { useRef } from "react";
import {
  Upload, Image as ImageIcon, CheckCircle, X,
  AlertCircle, ArrowRight, ArrowLeft, Notebook
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import SanityQuiz from "@/components/lab/SanityQuiz";
import { cn, wordCount } from "@/lib/utils";

const MIN_WORDS = 20;

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
  courseSlug,
}) {
  const fileRef = useRef(null);
  const words = wordCount(reflectionText);
  const wordValid = words >= MIN_WORDS;
  const screenshotValid = !step.requiresScreenshot || !!screenshotUrl;
  const canAdvance = wordValid && quizPassed && screenshotValid;
  const isFinal = currentStepIndex === totalSteps - 1;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (.png, .jpg, .jpeg, .webp)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onScreenshotChange(ev.target?.result ?? null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden border-l border-[var(--border)]">
      {/* Pane header */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] mb-1 font-medium uppercase tracking-wider">
          <Notebook className="w-3.5 h-3.5" />
          Your Notebook
        </div>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Complete all three sections to unlock the next step.
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* ── 1. Reflection ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <StepIndicator n={1} done={wordValid} />
            <div>
              <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                What did you learn?
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-3 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)] text-[13px] text-[var(--accent-text)] font-mono leading-snug">
            &gt; {step.promptQuestion}
          </div>

          <Textarea
            rows={5}
            value={reflectionText}
            onChange={(e) => onReflectionChange(e.target.value)}
            placeholder="Explain your reasoning in your own words. What happened? Why? What would break if you skipped this step?"
          />
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className={cn(
              "flex items-center gap-1 font-medium",
              wordValid ? "text-[var(--success)]" : "text-[var(--text-muted)]"
            )}>
              {wordValid && <CheckCircle className="w-3.5 h-3.5" />}
              {words} / {MIN_WORDS} words
            </span>
            {!wordValid && (
              <span className="text-[var(--text-muted)]">{MIN_WORDS - words} more words needed</span>
            )}
          </div>
        </section>

        {/* ── 2. Screenshot ─────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <StepIndicator n={2} done={screenshotValid && !!screenshotUrl} />
            <div>
              <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                Terminal or console screenshot
                {!step.requiresScreenshot && (
                  <span className="ml-2 text-[11px] font-normal text-[var(--text-muted)]">(optional)</span>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          {screenshotUrl ? (
            <div className="relative rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--surface-2)] border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--success)]">
                  <CheckCircle className="w-3.5 h-3.5" /> Proof attached
                </span>
                <button
                  type="button"
                  onClick={() => { onScreenshotChange(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1 rounded"
                  aria-label="Remove screenshot"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt="Terminal proof"
                className="w-full max-h-56 object-contain bg-[var(--surface-3)]"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={cn(
                "w-full border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] p-6",
                "text-center bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-subtle)]/30",
                "transition-all duration-150 cursor-pointer group"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] group-hover:bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-2 transition-colors">
                <Upload className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Upload terminal or cloud console screenshot
              </p>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                PNG, JPG, WEBP · Base64 embedded into your PDF dossier
              </p>
            </button>
          )}
        </section>

        {/* ── 3. Quiz ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <StepIndicator n={3} done={quizPassed} />
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">
              Knowledge check
            </div>
          </div>
          <SanityQuiz
            quiz={step.quiz}
            onPass={onQuizPass}
            isPassed={quizPassed}
            courseSlug={courseSlug}
            stepNumber={step.stepNumber}
          />
        </section>
      </div>

      {/* Footer nav */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 space-y-3">
        {/* Validation summary */}
        {!canAdvance && (
          <div className="flex items-start gap-2 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
            <AlertCircle className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" />
            <ul className="text-[12px] text-[var(--text-secondary)] space-y-0.5">
              {!wordValid       && <li>Write at least {MIN_WORDS} words in your reflection ({MIN_WORDS - words} remaining)</li>}
              {!screenshotValid && <li>Upload a terminal or console screenshot</li>}
              {!quizPassed      && <li>Pass the knowledge check quiz</li>}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            disabled={currentStepIndex === 0}
            onClick={onPrevStep}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex-1" />

          {isFinal ? (
            <Button
              variant="primary"
              size="md"
              disabled={!canAdvance || isSubmitting}
              isLoading={isSubmitting}
              onClick={onFinalizeLab}
              className="gap-2"
            >
              Finalize & Export PDF
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={!canAdvance}
              onClick={onNextStep}
              className="gap-1"
            >
              Next step <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ n, done }) {
  return (
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold border-2 transition-colors",
      done
        ? "bg-[var(--success)] border-[var(--success)] text-white"
        : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]"
    )}>
      {done ? <CheckCircle className="w-3.5 h-3.5" /> : n}
    </div>
  );
}
