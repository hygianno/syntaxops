"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Target, Video, BookOpen } from "lucide-react";
import CostWarningAlert from "@/components/lab/CostWarningAlert";
import CodeBlock from "@/components/lab/CodeBlock";

export default function StepInstructionPane({ step, currentStepIndex, totalSteps }) {
  if (!step) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Pane header */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] mb-1 font-medium uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Step {currentStepIndex + 1} of {totalSteps}
        </div>
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)] leading-snug">
          {step.title}
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Objective callout */}
        <div className="flex gap-3 p-4 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent-subtle)]">
          <Target className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-text)] mb-1">
              Objective
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              {step.objective}
            </p>
          </div>
        </div>

        {/* Cost warning */}
        {step.costAlert && <CostWarningAlert message={step.costAlert} />}

        {/* Video briefing */}
        {step.hasVideo && step.videoUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <Video className="w-3.5 h-3.5" />
              Briefing (optional)
            </div>
            <div className="aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
              <iframe
                src={step.videoUrl}
                title={step.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Markdown instructions */}
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const text  = String(children).replace(/\n$/, "");
                if (!inline) {
                  return <CodeBlock code={text} language={match?.[1] || "bash"} />;
                }
                return <code {...props}>{children}</code>;
              },
              h3: ({ children }) => (
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] uppercase tracking-wide mt-6 mb-2 pb-1.5 border-b border-[var(--border)]">
                  {children}
                </h3>
              ),
              p:  ({ children }) => (
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-3">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="pl-4 space-y-1.5 mb-3">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="pl-4 space-y-1.5 mb-3 list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[14px] text-[var(--text-secondary)] leading-relaxed list-disc">{children}</li>
              ),
            }}
          >
            {step.contentMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
