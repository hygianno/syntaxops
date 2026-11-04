"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SanityQuiz({ quiz, onPass, isPassed }) {
  const [selected, setSelected] = useState(null);
  const [attempted, setAttempted] = useState(false);

  if (!quiz) return null;

  const isCorrect = selected === quiz.answerIndex;

  const handleSelect = (idx) => {
    if (isPassed && isCorrect) return; // lock after pass
    setSelected(idx);
    setAttempted(true);
    onPass(idx === quiz.answerIndex);
  };

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Knowledge check
        </span>
        {isPassed && (
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
            const isAnswer = idx === quiz.answerIndex;

            let optStyle = "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]";

            if (attempted) {
              if (isThis && isCorrect)  optStyle = "border-[var(--success-border)] bg-[var(--success-subtle)] text-[var(--success)]";
              else if (isThis && !isCorrect) optStyle = "border-[var(--error-border)] bg-[var(--error-subtle)] text-[var(--error)]";
              else if (!isThis && isPassed && isAnswer) optStyle = "border-[var(--success-border)] bg-[var(--success-subtle)] text-[var(--success)] opacity-60";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-[6px] border",
                  "text-[13px] transition-all duration-150 cursor-pointer",
                  optStyle
                )}
              >
                <span className="shrink-0 w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
                {attempted && isThis && (
                  isCorrect
                    ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    : <XCircle    className="w-4 h-4 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {attempted && (
          <p className={cn(
            "text-[12px] font-medium pt-1",
            isCorrect ? "text-[var(--success)]" : "text-[var(--error)]"
          )}>
            {isCorrect
              ? "Correct — knowledge check passed. Milestone unlocked."
              : "Incorrect. Review the documentation above and try again."}
          </p>
        )}
      </div>
    </div>
  );
}
