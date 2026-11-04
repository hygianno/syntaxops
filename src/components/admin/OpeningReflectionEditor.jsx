import React from "react";
import Input, { Textarea } from "@/components/ui/Input";
import { MessageSquareCode } from "lucide-react";

export default function OpeningReflectionEditor({ course, onChange }) {
  const op = course.openingReflection || {
    question:
      "In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?",
    instructions: "Record your initial technical assumptions before provisioning resources.",
    isRequired: true,
    minWords: 20,
  };

  const updateOp = (field, value) => {
    onChange({
      ...course,
      openingReflection: {
        ...op,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Opening Reflection Configuration</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
          The opening reflection captures the learner&apos;s baseline understanding before executing code.
          Their original unedited response is preserved in their final project dossier.
        </p>
      </div>

      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)] mb-2">
          <MessageSquareCode className="w-4 h-4 text-[var(--accent)]" />
          <span>Opening Cognitive Prompt</span>
        </div>

        <Textarea
          label="Opening Reflection Prompt Question"
          rows={3}
          value={op.question || ""}
          onChange={(e) => updateOp("question", e.target.value)}
          placeholder="In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?"
          required
        />

        <Textarea
          label="Learner Instructions & Guidance"
          rows={2}
          value={op.instructions || ""}
          onChange={(e) => updateOp("instructions", e.target.value)}
          placeholder="e.g. Write candidly about your initial technical expectations. There are no wrong answers."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Minimum Word Count"
            type="number"
            value={op.minWords ?? 20}
            onChange={(e) => updateOp("minWords", Number(e.target.value))}
            placeholder="20"
            helperText="Enforces authentic reflection (default: 20 words)."
          />

          <div className="flex flex-col justify-center pt-5">
            <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={op.isRequired ?? true}
                onChange={(e) => updateOp("isRequired", e.target.checked)}
                className="rounded text-[var(--accent)]"
              />
              <span>Mandatory before beginning Step 1</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
