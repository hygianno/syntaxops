"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Target,
  Video,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Terminal,
  ExternalLink,
  Paperclip,
  Flame,
  ShieldAlert,
} from "lucide-react";
import CostWarningAlert from "@/components/lab/CostWarningAlert";
import CodeBlock from "@/components/lab/CodeBlock";

export default function StepInstructionPane({ step, currentStepIndex, totalSteps }) {
  const [checkedTasks, setCheckedTasks] = useState({});

  if (!step) return null;

  const toggleTask = (taskId) => {
    setCheckedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const hasBlocks = step.blocks && step.blocks.length > 0;

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
        {step.objective && (
          <div className="flex gap-3 p-4 rounded-[var(--radius-sm)] border border-[var(--accent)]/20 bg-[var(--accent-subtle)]">
            <Target className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-text)] mb-1">
                Milestone Objective
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {step.objective}
              </p>
            </div>
          </div>
        )}

        {/* Cost warning alert */}
        {step.costAlert && <CostWarningAlert message={step.costAlert} />}

        {/* Video briefing */}
        {step.hasVideo && step.videoUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <Video className="w-3.5 h-3.5" />
              Briefing Stream
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

        {/* ── Dynamic Content Blocks (Course Studio) ─────────────── */}
        {hasBlocks ? (
          <div className="space-y-4">
            {step.blocks.map((block, idx) => {
              const data = block.data || {};

              switch (block.type) {
                case "heading": {
                  const Tag = data.level === "h2" ? "h2" : data.level === "h4" ? "h4" : "h3";
                  return (
                    <Tag
                      key={block.id || idx}
                      className={`font-bold text-[var(--text-primary)] tracking-tight ${
                        data.level === "h2"
                          ? "text-[18px] mt-6 mb-2 border-b border-[var(--border)] pb-1"
                          : data.level === "h4"
                          ? "text-[14px] mt-4 mb-1"
                          : "text-[16px] mt-5 mb-1"
                      }`}
                    >
                      {data.text}
                    </Tag>
                  );
                }

                case "rich-text":
                  return (
                    <div key={block.id || idx} className="prose max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {data.content || ""}
                      </ReactMarkdown>
                    </div>
                  );

                case "code":
                  return (
                    <div key={block.id || idx} className="space-y-1">
                      {data.explanation && (
                        <p className="text-[12px] text-[var(--text-muted)] italic">
                          {data.explanation}
                        </p>
                      )}
                      <CodeBlock code={data.code || ""} language={data.language || "bash"} />
                    </div>
                  );

                case "definition":
                  return (
                    <div
                      key={block.id || idx}
                      className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-[4px]">
                          Concept Definition
                        </span>
                        {data.docUrl && (
                          <a
                            href={data.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Documentation</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <h4 className="text-[15px] font-bold text-[var(--text-primary)]">
                        {data.term}
                      </h4>
                      <p className="text-[13px] font-medium text-[var(--text-secondary)] leading-relaxed">
                        {data.simpleDefinition}
                      </p>
                      {data.detailedExplanation && (
                        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-2">
                          {data.detailedExplanation}
                        </p>
                      )}
                      {data.realWorldExample && (
                        <div className="text-[11px] text-[var(--accent-text)] bg-[var(--surface-2)] p-2 rounded-[4px] font-mono">
                          Example: {data.realWorldExample}
                        </div>
                      )}
                    </div>
                  );

                case "warning":
                  return (
                    <div
                      key={block.id || idx}
                      className={`p-4 rounded-[var(--radius-md)] border space-y-1.5 ${
                        data.severity === "destructive"
                          ? "bg-[var(--error-subtle)] border-[var(--error-border)] text-[var(--error)]"
                          : "bg-[var(--warning-subtle)] border-[var(--warning-border)] text-[var(--warning)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-[13px] uppercase tracking-wide">
                        {data.severity === "destructive" ? (
                          <Flame className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        <span>{data.title || "Critical Warning"}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[var(--text-primary)]">
                        {data.message}
                      </p>
                    </div>
                  );

                case "tip":
                  return (
                    <div
                      key={block.id || idx}
                      className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] space-y-1"
                    >
                      <div className="flex items-center gap-2 font-bold text-[12px] text-[var(--text-primary)] uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5 text-[var(--warning)]" />
                        <span>{data.title || "Pro Tip"}</span>
                      </div>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                        {data.message}
                      </p>
                    </div>
                  );

                case "image":
                  return (
                    <div key={block.id || idx} className="space-y-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.url}
                        alt={data.altText || data.caption || "Illustration"}
                        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] max-h-80 object-contain w-full"
                      />
                      {data.caption && (
                        <p className="text-[11px] text-center text-[var(--text-muted)] italic">
                          {data.caption}
                        </p>
                      )}
                    </div>
                  );

                case "video":
                  return (
                    <div key={block.id || idx} className="space-y-2">
                      <div className="aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]">
                        <iframe
                          src={data.url}
                          title={data.caption || "Briefing"}
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                      {data.caption && (
                        <p className="text-[11px] text-[var(--text-muted)] italic">{data.caption}</p>
                      )}
                    </div>
                  );

                case "checklist":
                  return (
                    <div
                      key={block.id || idx}
                      className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-2.5"
                    >
                      <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        <CheckSquare className="w-4 h-4 text-[var(--accent)]" />
                        <span>Execution Checklist</span>
                      </div>
                      <div className="space-y-2">
                        {(data.tasks || []).map((t, tIdx) => {
                          const taskId = t.id || `task-${tIdx}`;
                          const isDone = !!checkedTasks[taskId];
                          return (
                            <label
                              key={taskId}
                              onClick={() => toggleTask(taskId)}
                              className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] cursor-pointer select-none hover:text-[var(--text-primary)]"
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => {}}
                                className="mt-0.5 rounded text-[var(--accent)]"
                              />
                              <span className={isDone ? "line-through opacity-60" : ""}>{t.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );

                case "expected-output":
                  return (
                    <div key={block.id || idx} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Expected Terminal Output:</span>
                      </div>
                      <pre className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-3)] border border-[var(--border)] font-mono text-[12px] text-[var(--success)] overflow-x-auto leading-relaxed">
                        {data.content}
                      </pre>
                      {data.note && (
                        <p className="text-[11px] text-[var(--text-muted)] italic">{data.note}</p>
                      )}
                    </div>
                  );

                case "external-resource":
                  return (
                    <a
                      key={block.id || idx}
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] transition-all group"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                          {data.title || "External Resource"}
                        </div>
                        {data.description && (
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                            {data.description}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                    </a>
                  );

                case "attachment":
                  return (
                    <div
                      key={block.id || idx}
                      className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)]"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[var(--accent)]" />
                        <div>
                          <div className="text-[13px] font-medium text-[var(--text-primary)]">
                            {data.name || "Attachment"}
                          </div>
                          {data.description && (
                            <div className="text-[11px] text-[var(--text-muted)]">{data.description}</div>
                          )}
                        </div>
                      </div>
                      {data.url && (
                        <a
                          href={data.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-[var(--accent)] hover:underline font-medium"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        ) : (
          /* Fallback for legacy courses using contentMarkdown */
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const text = String(children).replace(/\n$/, "");
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
                p: ({ children }) => (
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-3">
                    {children}
                  </p>
                ),
              }}
            >
              {step.contentMarkdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
