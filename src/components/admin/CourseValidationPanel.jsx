import React from "react";
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";

export function evaluateCourseValidation(course) {
  const issues = [];
  const passed = [];

  // Title
  if (!course.title || course.title.trim().length < 5) {
    issues.push({ id: "title", label: "Project Title is missing or too short (< 5 chars)." });
  } else {
    passed.push({ id: "title", label: "Project Title configured." });
  }

  // Slug
  if (!course.slug || !/^[a-z0-9-]+$/.test(course.slug)) {
    issues.push({ id: "slug", label: "Valid lowercase URL slug is required." });
  } else {
    passed.push({ id: "slug", label: "URL slug valid." });
  }

  // Summary
  if (!course.summary || course.summary.trim().length < 15) {
    issues.push({ id: "summary", label: "Short summary is missing or brief (< 15 chars)." });
  } else {
    passed.push({ id: "summary", label: "Summary pitch configured." });
  }

  // Learning Objectives
  if (!course.learningObjectives || course.learningObjectives.filter((o) => o && o.trim()).length < 1) {
    issues.push({ id: "objectives", label: "At least one learning objective is required." });
  } else {
    passed.push({ id: "objectives", label: `${course.learningObjectives.length} learning objectives defined.` });
  }

  // Steps
  if (!course.steps || course.steps.length < 1) {
    issues.push({ id: "steps", label: "At least one project milestone step is required." });
  } else {
    const emptySteps = course.steps.filter((s) => !s.title || (s.blocks?.length === 0 && !s.contentMarkdown));
    if (emptySteps.length > 0) {
      issues.push({ id: "steps-content", label: `${emptySteps.length} step(s) lack titles or content blocks.` });
    } else {
      passed.push({ id: "steps", label: `${course.steps.length} milestones with content blocks.` });
    }
  }

  // Build Cost
  if (course.buildCost?.max === undefined) {
    issues.push({ id: "cost", label: "Infrastructure build cost range should be defined." });
  } else {
    passed.push({ id: "cost", label: "Cloud build cost estimates configured." });
  }

  const isValidForPublish = issues.length === 0;

  return { isValidForPublish, issues, passed };
}

export default function CourseValidationPanel({ course }) {
  const { isValidForPublish, issues, passed } = evaluateCourseValidation(course);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
          Publication Readiness
        </span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isValidForPublish
              ? "bg-[var(--success-subtle)] text-[var(--success)]"
              : "bg-[var(--warning-subtle)] text-[var(--warning)]"
          }`}
        >
          {isValidForPublish ? "Ready to Publish" : "Draft Incomplete"}
        </span>
      </div>

      {issues.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--error)] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing Requirements ({issues.length})</span>
          </div>
          <ul className="space-y-1.5 text-[12px] text-[var(--text-secondary)]">
            {issues.map((iss) => (
              <li key={iss.id} className="flex items-start gap-1.5">
                <span className="text-[var(--error)] font-bold">•</span>
                <span>{iss.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {passed.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validated Sections ({passed.length})</span>
          </div>
          <ul className="space-y-1 text-[12px] text-[var(--text-muted)]">
            {passed.map((p) => (
              <li key={p.id} className="flex items-center gap-1.5">
                <span className="text-[var(--success)]">✓</span>
                <span className="truncate">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
