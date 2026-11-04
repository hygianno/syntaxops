import React from "react";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Plus, Trash2, HelpCircle, ShieldAlert } from "lucide-react";

export default function AssessmentEditor({ course, onChange }) {
  const assessment = course.assessment || {
    passingScore: 80,
    maxAttempts: 3,
    isRequired: false,
    questions: [],
  };

  const updateAssessment = (field, value) => {
    onChange({
      ...course,
      assessment: {
        ...assessment,
        [field]: value,
      },
    });
  };

  const questions = assessment.questions || [];

  const addQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      type: "single-choice",
      question: "Which AWS resource routes traffic from public subnets to the internet?",
      options: [
        "Internet Gateway",
        "NAT Gateway",
        "Virtual Private Gateway",
        "Egress-Only Internet Gateway",
      ],
      correctAnswer: "Internet Gateway",
      explanation: "An Internet Gateway attaches to the VPC and provides route targets for 0.0.0.0/0.",
      points: 10,
    };
    updateAssessment("questions", [...questions, newQ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    updateAssessment("questions", updated);
  };

  const removeQuestion = (index) => {
    updateAssessment("questions", questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Project-Level Assessment</h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
            Configure cumulative questions. Answers are evaluated strictly on the server and never exposed to the client.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={addQuestion} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Question</span>
        </Button>
      </div>

      {/* Global Assessment Settings */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Assessment Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <Input
            label="Passing Score (%)"
            type="number"
            value={assessment.passingScore ?? 80}
            onChange={(e) => updateAssessment("passingScore", Number(e.target.value))}
            placeholder="80"
          />
          <Input
            label="Max Attempts Allowed"
            type="number"
            value={assessment.maxAttempts ?? 3}
            onChange={(e) => updateAssessment("maxAttempts", Number(e.target.value))}
            placeholder="3"
          />
          <div className="flex flex-col justify-center pt-5">
            <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={assessment.isRequired ?? false}
                onChange={(e) => updateAssessment("isRequired", e.target.checked)}
                className="rounded text-[var(--accent)]"
              />
              <span>Assessment Required for Dossier</span>
            </label>
          </div>
        </div>
      </section>

      {/* Questions List */}
      <section className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
                  Question #{qIdx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[var(--text-muted)] font-mono">{q.points || 10} pts</span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="text-[var(--text-muted)] hover:text-[var(--error)] p-1 rounded"
                    title="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Input
                label="Question Statement"
                value={q.question || ""}
                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                placeholder="e.g. What is the consequence of attaching an IGW without updating route tables?"
                required
              />

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[var(--text-secondary)] block">
                  Options (Radio selects the correct answer for server-side grading)
                </label>
                {(q.options || ["", "", "", ""]).map((opt, optIdx) => {
                  const isCorrect = q.correctAnswer === opt && opt !== "";
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-ans-${q.id || qIdx}`}
                        checked={isCorrect}
                        onChange={() => updateQuestion(qIdx, "correctAnswer", opt)}
                        className="text-[var(--accent)]"
                      />
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const opts = [...(q.options || ["", "", "", ""])];
                          opts[optIdx] = e.target.value;
                          updateQuestion(qIdx, "options", opts);
                          if (isCorrect) updateQuestion(qIdx, "correctAnswer", e.target.value);
                        }}
                        wrapperClassName="flex-1"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Explanation"
                    value={q.explanation || ""}
                    onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                    placeholder="Explanation displayed after submission"
                  />
                </div>
                <div>
                  <Input
                    label="Points"
                    type="number"
                    value={q.points || 10}
                    onChange={(e) => updateQuestion(qIdx, "points", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)] text-[13px] text-[var(--text-muted)]">
            No project-level assessment questions created yet. Click &quot;Add Question&quot; to build comprehension checks.
          </div>
        )}
      </section>
    </div>
  );
}
