import React from "react";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function PrerequisitesEditor({ course, onChange }) {
  const prereqs = course.prerequisites || [];

  const updatePrereqs = (updated) => {
    onChange({ ...course, prerequisites: updated });
  };

  const addPrereq = () => {
    const updated = [
      ...prereqs,
      {
        name: "AWS Account & IAM User",
        description: "An active AWS account with programmatic CLI access.",
        setupInstructions: "Generate access keys in IAM and configure with `aws configure`.",
        docUrl: "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html",
        verifyCommand: "aws sts get-caller-identity",
        isRequired: true,
      },
    ];
    updatePrereqs(updated);
  };

  const updatePrereq = (index, field, value) => {
    const updated = [...prereqs];
    updated[index] = { ...updated[index], [field]: value };
    updatePrereqs(updated);
  };

  const removePrereq = (index) => {
    updatePrereqs(prereqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Prerequisites Manager</h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
            Define requirements, setup commands, and verification checks learners must complete before execution.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={addPrereq} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Prerequisite</span>
        </Button>
      </div>

      {prereqs.length > 0 ? (
        <div className="space-y-4">
          {prereqs.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                  Prerequisite #{idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isRequired ?? true}
                      onChange={(e) => updatePrereq(idx, "isRequired", e.target.checked)}
                      className="rounded text-[var(--accent)]"
                    />
                    <span>Mandatory</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removePrereq(idx)}
                    className="text-[var(--text-muted)] hover:text-[var(--error)] p-1 rounded"
                    title="Remove prerequisite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Requirement Name"
                  value={item.name || ""}
                  onChange={(e) => updatePrereq(idx, "name", e.target.value)}
                  placeholder="e.g. Docker Engine & Docker Compose"
                  required
                />
                <Input
                  label="Verification Command (CLI)"
                  value={item.verifyCommand || ""}
                  onChange={(e) => updatePrereq(idx, "verifyCommand", e.target.value)}
                  placeholder="e.g. docker --version"
                />
              </div>

              <Input
                label="Description"
                value={item.description || ""}
                onChange={(e) => updatePrereq(idx, "description", e.target.value)}
                placeholder="e.g. Needed to spin up local Kubernetes KinD cluster containers."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Setup Instructions"
                  value={item.setupInstructions || ""}
                  onChange={(e) => updatePrereq(idx, "setupInstructions", e.target.value)}
                  placeholder="e.g. Install Docker Desktop or Docker CE for Ubuntu."
                />
                <Input
                  label="Documentation Link URL"
                  value={item.docUrl || ""}
                  onChange={(e) => updatePrereq(idx, "docUrl", e.target.value)}
                  placeholder="https://docs.docker.com/engine/install/"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface)] text-[13px] text-[var(--text-muted)]">
          No prerequisites added yet. Click &quot;Add Prerequisite&quot; to configure dependencies.
        </div>
      )}
    </div>
  );
}
