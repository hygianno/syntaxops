import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Plus, Trash2, Target, GripVertical } from "lucide-react";

export default function ObjectivesEditor({ course, onChange }) {
  const objectives = course.learningObjectives || [];

  const updateObjectives = (updated) => {
    onChange({ ...course, learningObjectives: updated });
  };

  const addObjective = () => {
    updateObjectives([...objectives, ""]);
  };

  const updateItem = (index, value) => {
    const updated = [...objectives];
    updated[index] = value;
    updateObjectives(updated);
  };

  const removeItem = (index) => {
    updateObjectives(objectives.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Learning Objectives</h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
            Explicit skills and architectural proficiencies learners will acquire and demonstrate in their dossier.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={addObjective} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Objective</span>
        </Button>
      </div>

      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        {objectives.length > 0 ? (
          <div className="space-y-3">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[12px] font-mono text-[var(--text-muted)] w-6 text-center shrink-0">
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <Input
                    placeholder="e.g. Apply Infrastructure as Code patterns using Pulumi with automated verification"
                    value={obj}
                    onChange={(e) => updateItem(idx, e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] rounded"
                  title="Remove objective"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-muted)]">
            No learning objectives added. Define at least 2–3 key technical capabilities.
          </div>
        )}
      </section>
    </div>
  );
}
