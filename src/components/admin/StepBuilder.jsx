import React, { useState, useRef } from "react";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ContentBlockSelector, { BLOCK_TYPES } from "@/components/admin/ContentBlockSelector";
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  CheckCircle,
  HelpCircle,
  Code2,
  AlertTriangle,
  BookOpen,
  Terminal,
  Heading,
  FileText,
  Lightbulb,
  CheckSquare,
  ExternalLink,
  Camera,
  Paperclip,
} from "lucide-react";

export default function StepBuilder({ step, onChange, onDelete, onDuplicate }) {
  const [isBlockSelectorOpen, setIsBlockSelectorOpen] = useState(false);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState(null);
  const fileRef = useRef(null);

  if (!step) return null;

  const updateStepField = (field, value) => {
    onChange({ ...step, [field]: value });
  };

  const blocks = step.blocks || [];

  const updateBlocks = (newBlocks) => {
    onChange({ ...step, blocks: newBlocks });
  };

  const handleAddBlock = (type, defaultData) => {
    const newBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      data: { ...defaultData },
    };
    updateBlocks([...blocks, newBlock]);
  };

  const updateBlockData = (index, field, value) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      data: {
        ...(updated[index].data || {}),
        [field]: value,
      },
    };
    updateBlocks(updated);
  };

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    updateBlocks(updated);
  };

  const duplicateBlock = (index) => {
    const target = blocks[index];
    const clone = {
      ...target,
      id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      data: { ...target.data },
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, clone);
    updateBlocks(updated);
  };

  const deleteBlock = (index) => {
    updateBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e, blockIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        updateBlockData(blockIndex, "url", data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Hidden file input for block image upload */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (uploadingBlockIndex !== null) {
            handleImageUpload(e, uploadingBlockIndex);
          }
        }}
        className="hidden"
      />

      {/* Step Header & Meta */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-[12px] font-bold flex items-center justify-center">
              {step.stepNumber}
            </span>
            <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
              Milestone #{step.stepNumber} Settings
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              title="Duplicate this entire milestone"
            >
              <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate Step
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-[var(--error)] hover:bg-[var(--error-subtle)]"
              title="Delete milestone"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Step
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Milestone Title"
              value={step.title || ""}
              onChange={(e) => updateStepField("title", e.target.value)}
              placeholder="e.g. Subnet Allocation & Route Table Isolation"
              required
            />
          </div>
          <div>
            <Input
              label="Est. Duration (Minutes)"
              type="number"
              value={step.estimatedMinutes ?? 30}
              onChange={(e) => updateStepField("estimatedMinutes", Number(e.target.value))}
            />
          </div>
        </div>

        <Input
          label="Milestone Objective"
          value={step.objective || ""}
          onChange={(e) => updateStepField("objective", e.target.value)}
          placeholder="e.g. Carve a 10.0.0.0/16 VPC block into segregated Public and Private subnets across 2 AZs."
        />
      </section>

      {/* Dynamic Content Blocks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Content Blocks</h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Build instructions using modular blocks (Code, Definitions, Warnings, Checklists, Quizzes).
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsBlockSelectorOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Content Block</span>
          </Button>
        </div>

        {blocks.length > 0 ? (
          <div className="space-y-4">
            {blocks.map((block, idx) => {
              const def = BLOCK_TYPES.find((b) => b.type === block.type);
              const Icon = def?.icon || FileText;

              return (
                <div
                  key={block.id || idx}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)]"
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                        {def?.label || block.type}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveBlock(idx, -1)}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === blocks.length - 1}
                        onClick={() => moveBlock(idx, 1)}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(idx)}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        title="Duplicate Block"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlock(idx)}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--error)]"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Editor Content */}
                  <div className="p-4 space-y-3">
                    {/* Heading Block */}
                    {block.type === "heading" && (
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-3">
                          <Input
                            placeholder="Heading Text"
                            value={block.data?.text || ""}
                            onChange={(e) => updateBlockData(idx, "text", e.target.value)}
                          />
                        </div>
                        <div>
                          <select
                            value={block.data?.level || "h3"}
                            onChange={(e) => updateBlockData(idx, "level", e.target.value)}
                            className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)]"
                          >
                            <option value="h2">H2 Section</option>
                            <option value="h3">H3 Sub-section</option>
                            <option value="h4">H4 Small Header</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Rich Text Block */}
                    {block.type === "rich-text" && (
                      <Textarea
                        rows={4}
                        placeholder="Write markdown instructions, code explanations, or architectural context..."
                        value={block.data?.content || ""}
                        onChange={(e) => updateBlockData(idx, "content", e.target.value)}
                      />
                    )}

                    {/* Code Block */}
                    {block.type === "code" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={block.data?.language || "bash"}
                            onChange={(e) => updateBlockData(idx, "language", e.target.value)}
                            className="h-8 px-3 rounded-[6px] text-[12px] font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)]"
                          >
                            <option value="bash">bash / sh</option>
                            <option value="yaml">yaml</option>
                            <option value="dockerfile">dockerfile</option>
                            <option value="typescript">typescript</option>
                            <option value="javascript">javascript</option>
                            <option value="python">python</option>
                            <option value="hcl">hcl / terraform</option>
                            <option value="json">json</option>
                            <option value="sql">sql</option>
                          </select>
                          <Input
                            placeholder="Brief code context (e.g. Run in local terminal)"
                            value={block.data?.explanation || ""}
                            onChange={(e) => updateBlockData(idx, "explanation", e.target.value)}
                            wrapperClassName="flex-1"
                          />
                        </div>
                        <Textarea
                          rows={4}
                          className="font-mono text-[12px]"
                          placeholder="aws ec2 create-vpc --cidr-block 10.0.0.0/16"
                          value={block.data?.code || ""}
                          onChange={(e) => updateBlockData(idx, "code", e.target.value)}
                        />
                      </div>
                    )}

                    {/* Definition Block */}
                    {block.type === "definition" && (
                      <div className="space-y-3 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Technical Term"
                            placeholder="e.g. Infrastructure as Code"
                            value={block.data?.term || ""}
                            onChange={(e) => updateBlockData(idx, "term", e.target.value)}
                          />
                          <Input
                            label="External Documentation Link"
                            placeholder="https://..."
                            value={block.data?.docUrl || ""}
                            onChange={(e) => updateBlockData(idx, "docUrl", e.target.value)}
                          />
                        </div>
                        <Textarea
                          label="Simple Definition (1-2 sentences)"
                          rows={2}
                          placeholder="Managing and provisioning computer data centers through machine-readable definition files..."
                          value={block.data?.simpleDefinition || ""}
                          onChange={(e) => updateBlockData(idx, "simpleDefinition", e.target.value)}
                        />
                        <Textarea
                          label="Detailed Technical Explanation"
                          rows={3}
                          placeholder="Explain how version control, testing, and declarative manifests apply..."
                          value={block.data?.detailedExplanation || ""}
                          onChange={(e) => updateBlockData(idx, "detailedExplanation", e.target.value)}
                        />
                        <Input
                          label="Real-World Example"
                          placeholder="e.g. Using Terraform or Pulumi to spin up reproducible EKS clusters."
                          value={block.data?.realWorldExample || ""}
                          onChange={(e) => updateBlockData(idx, "realWorldExample", e.target.value)}
                        />
                      </div>
                    )}

                    {/* Warning Block */}
                    {block.type === "warning" && (
                      <div className="space-y-3 p-3 rounded-[6px] bg-[var(--warning-subtle)]/40 border border-[var(--warning-border)]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Warning Title"
                            value={block.data?.title || ""}
                            onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                            placeholder="e.g. AWS NAT Gateway Hourly Cost Hazard"
                          />
                          <div>
                            <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-1">
                              Warning Category
                            </label>
                            <select
                              value={block.data?.severity || "billing"}
                              onChange={(e) => updateBlockData(idx, "severity", e.target.value)}
                              className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                            >
                              <option value="billing">Cloud Billing Hazard</option>
                              <option value="security">Security Vulnerability Risk</option>
                              <option value="destructive">Destructive / Data Loss Action</option>
                            </select>
                          </div>
                        </div>
                        <Textarea
                          label="Warning Message & Resolution"
                          rows={2}
                          value={block.data?.message || ""}
                          onChange={(e) => updateBlockData(idx, "message", e.target.value)}
                          placeholder="NAT Gateways incur continuous hourly charges. Be sure to run teardown instructions immediately after testing."
                        />
                      </div>
                    )}

                    {/* Tip Block */}
                    {block.type === "tip" && (
                      <div className="space-y-3 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
                        <Input
                          label="Tip Title"
                          value={block.data?.title || ""}
                          onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                          placeholder="e.g. Shell Autocompletion Tip"
                        />
                        <Textarea
                          label="Recommendation"
                          rows={2}
                          value={block.data?.message || ""}
                          onChange={(e) => updateBlockData(idx, "message", e.target.value)}
                          placeholder="Install bash-completion to tab-complete kubectl and aws commands."
                        />
                      </div>
                    )}

                    {/* Image Block */}
                    {block.type === "image" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Image URL or upload file"
                            value={block.data?.url || ""}
                            onChange={(e) => updateBlockData(idx, "url", e.target.value)}
                            wrapperClassName="flex-1"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => {
                              setUploadingBlockIndex(idx);
                              fileRef.current?.click();
                            }}
                            className="gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" /> Upload
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Caption (e.g. AWS VPC Route Table Association)"
                            value={block.data?.caption || ""}
                            onChange={(e) => updateBlockData(idx, "caption", e.target.value)}
                          />
                          <Input
                            placeholder="Alt text"
                            value={block.data?.altText || ""}
                            onChange={(e) => updateBlockData(idx, "altText", e.target.value)}
                          />
                        </div>
                        {block.data?.url && (
                          <div className="pt-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.data.url}
                              alt={block.data.altText || "Preview"}
                              className="max-h-48 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expected Output Block */}
                    {block.type === "expected-output" && (
                      <div className="space-y-3">
                        <Input
                          placeholder="Output Note (e.g. You should see HTTP 200 and state: available)"
                          value={block.data?.note || ""}
                          onChange={(e) => updateBlockData(idx, "note", e.target.value)}
                        />
                        <Textarea
                          rows={3}
                          className="font-mono text-[12px]"
                          placeholder="HTTP/1.1 200 OK&#10;Content-Type: application/json"
                          value={block.data?.content || ""}
                          onChange={(e) => updateBlockData(idx, "content", e.target.value)}
                        />
                      </div>
                    )}

                    {/* Checklist Block */}
                    {block.type === "checklist" && (
                      <div className="space-y-2">
                        <label className="text-[12px] font-medium text-[var(--text-secondary)] block">
                          Tasks for the Learner to Verify
                        </label>
                        {(block.data?.tasks || []).map((task, taskIdx) => (
                          <div key={taskIdx} className="flex items-center gap-2">
                            <span className="text-[12px] text-[var(--text-muted)] w-5">#{taskIdx + 1}</span>
                            <Input
                              value={task.text || ""}
                              onChange={(e) => {
                                const newTasks = [...(block.data.tasks || [])];
                                newTasks[taskIdx] = { ...newTasks[taskIdx], text: e.target.value };
                                updateBlockData(idx, "tasks", newTasks);
                              }}
                              wrapperClassName="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newTasks = (block.data.tasks || []).filter((_, i) => i !== taskIdx);
                                updateBlockData(idx, "tasks", newTasks);
                              }}
                              className="text-[var(--text-muted)] hover:text-[var(--error)] p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newTasks = [
                              ...(block.data?.tasks || []),
                              { id: `c-${Date.now()}`, text: "New task milestone verification" },
                            ];
                            updateBlockData(idx, "tasks", newTasks);
                          }}
                          className="gap-1 mt-1 text-[12px]"
                        >
                          <Plus className="w-3 h-3" /> Add Task Item
                        </Button>
                      </div>
                    )}

                    {/* Step Reflection Block */}
                    {block.type === "reflection" && (
                      <div className="space-y-3 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
                        <Textarea
                          label="Step Cognitive Question"
                          rows={2}
                          value={block.data?.prompt || ""}
                          onChange={(e) => updateBlockData(idx, "prompt", e.target.value)}
                          placeholder="e.g. Why did we assign a /24 subnet mask to the public load balancer tier?"
                        />
                        <Input
                          label="Min Word Count"
                          type="number"
                          value={block.data?.minWords ?? 20}
                          onChange={(e) => updateBlockData(idx, "minWords", Number(e.target.value))}
                        />
                      </div>
                    )}

                    {/* Quiz Block */}
                    {block.type === "quiz" && (
                      <div className="space-y-3 p-4 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
                        <Input
                          label="Sanity Quiz Question"
                          value={block.data?.question || ""}
                          onChange={(e) => updateBlockData(idx, "question", e.target.value)}
                          placeholder="e.g. What is the difference between an IGW and a NAT Gateway?"
                          required
                        />

                        <div className="space-y-2">
                          <label className="text-[12px] font-medium text-[var(--text-secondary)] block">
                            Options (Select the correct answer radio button)
                          </label>
                          {(block.data?.options || ["Option A", "Option B", "Option C", "Option D"]).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`quiz-answer-${block.id}`}
                                checked={(block.data?.answerIndex ?? 0) === optIdx}
                                onChange={() => updateBlockData(idx, "answerIndex", optIdx)}
                                className="text-[var(--accent)]"
                              />
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const opts = [...(block.data.options || ["", "", "", ""])];
                                  opts[optIdx] = e.target.value;
                                  updateBlockData(idx, "options", opts);
                                }}
                                wrapperClassName="flex-1"
                              />
                            </div>
                          ))}
                        </div>

                        <Textarea
                          label="Answer Explanation (Shown after learner passes/fails)"
                          rows={2}
                          value={block.data?.explanation || ""}
                          onChange={(e) => updateBlockData(idx, "explanation", e.target.value)}
                          placeholder="e.g. An Internet Gateway supports bidirectional routing, while a NAT Gateway is outbound-only."
                        />
                      </div>
                    )}

                    {/* Evidence Submission Block */}
                    {block.type === "evidence" && (
                      <div className="space-y-3 p-3 rounded-[6px] bg-[var(--surface-2)] border border-[var(--border)]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-1">
                              Evidence Type
                            </label>
                            <select
                              value={block.data?.evidenceType || "screenshot"}
                              onChange={(e) => updateBlockData(idx, "evidenceType", e.target.value)}
                              className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                            >
                              <option value="screenshot">Terminal / Cloud Console Screenshot</option>
                              <option value="log">Raw Command Output / Hash</option>
                              <option value="repo">GitHub Repository / Deployment URL</option>
                            </select>
                          </div>
                          <div className="flex flex-col justify-center pt-4">
                            <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={block.data?.isRequired ?? true}
                                onChange={(e) => updateBlockData(idx, "isRequired", e.target.checked)}
                                className="rounded text-[var(--accent)]"
                              />
                              <span>Mandatory for milestone completion</span>
                            </label>
                          </div>
                        </div>
                        <Textarea
                          label="Submission Instructions"
                          rows={2}
                          value={block.data?.instructions || ""}
                          onChange={(e) => updateBlockData(idx, "instructions", e.target.value)}
                          placeholder="Upload a screenshot of your terminal executing aws ec2 describe-vpcs showing state: available."
                        />
                      </div>
                    )}

                    {/* External Resource Block */}
                    {block.type === "external-resource" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Resource Title"
                          value={block.data?.title || ""}
                          onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                          placeholder="e.g. AWS VPC Best Practices Guide"
                        />
                        <Input
                          label="Resource URL"
                          value={block.data?.url || ""}
                          onChange={(e) => updateBlockData(idx, "url", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)]">
            <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
              No content blocks in this milestone yet
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto mb-4">
              Add instructions, code snippets, definitions, warnings, and sanity quizzes to build an interactive learning step.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsBlockSelectorOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Content Block</span>
            </Button>
          </div>
        )}
      </section>

      {/* Block Selector Modal */}
      <ContentBlockSelector
        isOpen={isBlockSelectorOpen}
        onClose={() => setIsBlockSelectorOpen(false)}
        onSelect={handleAddBlock}
      />
    </div>
  );
}
