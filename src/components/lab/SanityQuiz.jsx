"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SanityQuiz({
  quiz,
  onPass,
  isPassed,
  courseSlug,
  stepNumber,
}) {
  const [selected, setSelected] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [serverIsCorrect, setServerIsCorrect] = useState(null);
  const [serverExplanation, setServerExplanation] = useState(null);

  if (!quiz) return null;

  // Determine if answer is correct based on local answerIndex or server response
  const isCorrect =
    serverIsCorrect !== null
      ? serverIsCorrect
      : quiz.answerIndex !== undefined
      ? selected === quiz.answerIndex
      : false;

  const handleSelect = async (idx) => {
    if (isPassed && isCorrect) return; // lock after pass
    setSelected(idx);
    setAttempted(true);

    // If answerIndex is known locally (e.g. mockCourses or preview mode)
    if (quiz.answerIndex !== undefined) {
      const correct = idx === quiz.answerIndex;
      setServerIsCorrect(correct);
      onPass(correct);
      return;
    }

    // Server-side grading mode (protects answer keys from DevTools)
    if (courseSlug && stepNumber) {
      setIsValidating(true);
      try {
        const res = await fetch(`/api/courses/${courseSlug}/grade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "step-quiz",
            stepNumber,
            selectedAnswer: idx,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setServerIsCorrect(data.isCorrect);
          setServerExplanation(data.explanation || null);
          onPass(data.isCorrect);
        } else {
          // If server error, fallback safely
          setServerIsCorrect(false);
          onPass(false);
        }
      } catch (err) {
        console.error("Grading request failed:", err);
        setServerIsCorrect(false);
        onPass(false);
      } finally {
        setIsValidating(false);
      }
    } else {
      // Fallback
      onPass(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Knowledge check
        </span>
        {isValidating && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
          </span>
        )}
        {isPassed && !isValidating && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-[var(--success)]">
            <CheckCircle className="w-3.5 h-3.5" /> Verified
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <p className="text-[13px] font-medium text-[var(--text-primary)] leading-snug">
          {quiz.question}
        </p>

        <div className="space-y-2">
          {quiz.options.map((opt, idx) => {
            const isThis = selected === idx;
            const isAnswer =
              quiz.answerIndex !== undefined
                ? idx === quiz.answerIndex
                : false;

            let optStyle =
              "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]";

            if (attempted) {
              if (isThis && isCorrect)
                optStyle =
                  "border-[var(--success-border)] bg-[var(--success-subtle)] text-[var(--success)]";
              else if (isThis && !isCorrect)
                optStyle =
                  "border-[var(--error-border)] bg-[var(--error-subtle)] text-[var(--error)]";
              else if (!isThis && isPassed && isAnswer)
                optStyle =
                  "border-[var(--success-border)] bg-[var(--success-subtle)] text-[var(--success)] opacity-60";
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isValidating}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-[6px] border",
                  "text-[13px] transition-all duration-150 cursor-pointer disabled:opacity-70",
                  optStyle
                )}
              >
                <span className="shrink-0 w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
                {attempted && isThis && (
                  isCorrect ? (
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {attempted && !isValidating && (
          <div className="space-y-1 pt-1">
            <p
              className={cn(
                "text-[12px] font-medium",
                isCorrect ? "text-[var(--success)]" : "text-[var(--error)]"
              )}
            >
              {isCorrect
                ? "Correct — knowledge check passed. Milestone unlocked."
                : "Incorrect. Review the documentation above and try again."}
            </p>
            {(serverExplanation || quiz.explanation) && isCorrect && (
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                {serverExplanation || quiz.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
