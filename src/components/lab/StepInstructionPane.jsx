"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Video, Target, Compass } from "lucide-react";
import CostWarningAlert from "@/components/lab/CostWarningAlert";
import CodeBlock from "@/components/lab/CodeBlock";

export default function StepInstructionPane({ step, currentStepIndex, totalSteps }) {
  if (!step) return null;

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800/80 overflow-y-auto p-6 space-y-6">
      {/* Milestone Header */}
      <div className="space-y-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Milestone {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
            Step {step.stepNumber}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">{step.title}</h2>
      </div>

      {/* Architectural Objective Callout */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <Target className="w-4 h-4" />
          <span>Architectural Objective</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {step.objective}
        </p>
      </div>

      {/* Cloud Cost / Blast Radius Hazard */}
      {step.costAlert && <CostWarningAlert message={step.costAlert} />}

      {/* Optional YouTube Micro-Briefing Video */}
      {step.hasVideo && step.videoUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>Operational Briefing Stream</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
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

      {/* Markdown Content with Code Block Renderer */}
      <div className="prose prose-invert prose-xs max-w-none space-y-3 text-slate-300 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeText = String(children).replace(/\n$/, "");
              if (!inline && (match || codeText.includes("\n") || codeText.startsWith("aws") || codeText.startsWith("docker") || codeText.startsWith("kubectl"))) {
                return (
                  <CodeBlock
                    code={codeText}
                    language={match ? match[1] : "bash"}
                  />
                );
              }
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-800"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider pt-2 border-t border-slate-900">
                  {children}
                </h3>
              );
            },
            p({ children }) {
              return <p className="text-xs text-slate-300 leading-relaxed">{children}</p>;
            },
            ul({ children }) {
              return <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-300">{children}</ol>;
            },
          }}
        >
          {step.contentMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
