"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export default function SanityQuiz({ quiz, onPass, isPassed }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  if (!quiz) return null;

  const handleSelect = (index) => {
    setSelectedOption(index);
    setHasAttempted(true);
    if (index === quiz.answerIndex) {
      onPass(true);
    } else {
      onPass(false);
    }
  };

  const isCorrect = selectedOption === quiz.answerIndex;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
        <HelpCircle className="w-4 h-4" />
        <span>Conceptual Sanity Check</span>
      </div>

      <p className="text-xs font-medium text-slate-200 leading-relaxed">
        {quiz.question}
      </p>

      <div className="space-y-2 pt-1">
        {quiz.options.map((option, idx) => {
          let stateStyle = "border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300";

          if (hasAttempted && selectedOption === idx) {
            stateStyle = isCorrect
              ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
              : "border-rose-500 bg-rose-950/40 text-rose-200";
          } else if (isPassed && idx === quiz.answerIndex) {
            stateStyle = "border-emerald-500/60 bg-emerald-950/30 text-emerald-200";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${stateStyle}`}
            >
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {hasAttempted && selectedOption === idx && (
                isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )
              )}
            </button>
          );
        })}
      </div>

      {hasAttempted && (
        <div className="text-[11px] pt-1">
          {isCorrect ? (
            <p className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sanity check verified. Milestone requirement unlocked.
            </p>
          ) : (
            <p className="text-rose-400 font-medium">
              Incorrect analysis. Review the architectural documentation and retry.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
