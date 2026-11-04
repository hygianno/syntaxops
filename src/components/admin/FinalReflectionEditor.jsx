import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Plus, Trash2, Award, MessageSquare } from "lucide-react";

export default function FinalReflectionEditor({ course, onChange }) {
  const finalRef = course.finalReflection || {
    questions: [
      { id: "fr-1", question: "What technical components did you build and verify?", isRequired: true },
      { id: "fr-2", question: "What was the most challenging failure mode you encountered, and how did you debug it?", isRequired: true },
      { id: "fr-3", question: "How would you automate this infrastructure in an enterprise CI/CD pipeline?", isRequired: true },
    ],
  };

  const updateFinalRef = (updatedQuestions) => {
    onChange({
      ...course,
      finalReflection: {
        ...finalRef,
        questions: updatedQuestions,
      },
    });
  };

  const addQuestion = () => {
    const updated = [
      ...(finalRef.questions || []),
      {
        id: `fr-${Date.now()}`,
        question: "How would you monitor and audit this infrastructure in production?",
        isRequired: true,
      },
    ];
    updateFinalRef(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...(finalRef.questions || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateFinalRef(updated);
  };

  const removeItem = (index) => {
    updateFinalRef((finalRef.questions || []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Final Reflection Questions</h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
            Prompt learners to articulate their retrospective discoveries upon completing all milestones.
            Their authentic responses are compiled directly into the verifiable PDF dossier.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={addQuestion} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Reflection Question</span>
        </Button>
      </div>

      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        {(finalRef.questions || []).length > 0 ? (
          <div className="space-y-3">
            {finalRef.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="flex items-center gap-3 p-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface-2)]"
              >
                <span className="text-[12px] font-mono text-[var(--text-muted)] w-6 text-center">
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <Input
                    placeholder="e.g. What was the most significant concept you mastered?"
                    value={q.question || ""}
                    onChange={(e) => updateItem(idx, "question", e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={q.isRequired ?? true}
                    onChange={(e) => updateItem(idx, "isRequired", e.target.checked)}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Required</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--error)] rounded"
                  title="Remove question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-muted)]">
            No final reflection questions added yet.
          </div>
        )}
      </section>
    </div>
  );
}
