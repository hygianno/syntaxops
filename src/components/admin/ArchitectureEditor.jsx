import React, { useRef, useState } from "react";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";

export default function ArchitectureEditor({ course, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const arch = course.architecture || { diagrams: [], dataFlow: "", components: [] };

  const updateArch = (field, value) => {
    onChange({
      ...course,
      architecture: {
        ...arch,
        [field]: value,
      },
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const newDiagrams = [
          ...(arch.diagrams || []),
          { url: data.url, caption: file.name, description: "High-level topology diagram" },
        ];
        updateArch("diagrams", newDiagrams);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading diagram: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addManualDiagram = () => {
    const newDiagrams = [
      ...(arch.diagrams || []),
      { url: "", caption: "Architecture Topology Diagram", description: "Describes the overall data flow." },
    ];
    updateArch("diagrams", newDiagrams);
  };

  const updateDiagram = (index, field, value) => {
    const updated = [...(arch.diagrams || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateArch("diagrams", updated);
  };

  const removeDiagram = (index) => {
    const updated = (arch.diagrams || []).filter((_, i) => i !== index);
    updateArch("diagrams", updated);
  };

  // Components table
  const addComponent = () => {
    const updated = [
      ...(arch.components || []),
      { name: "Application Load Balancer", role: "Public Ingress Traffic Distribution", service: "AWS ALB" },
    ];
    updateArch("components", updated);
  };

  const updateComponent = (index, field, value) => {
    const updated = [...(arch.components || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateArch("components", updated);
  };

  const removeComponent = (index) => {
    const updated = (arch.components || []).filter((_, i) => i !== index);
    updateArch("components", updated);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Architecture & Topology</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
          Upload architecture diagrams, describe data flow, and define individual infrastructure components.
        </p>
      </div>

      {/* Diagrams */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Architecture Diagrams</h3>
            <p className="text-[13px] text-[var(--text-secondary)]">PNG, JPG, SVG, or URL references.</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={uploading}
              className="gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addManualDiagram}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </Button>
          </div>
        </div>

        {arch.diagrams && arch.diagrams.length > 0 ? (
          <div className="space-y-4 pt-2">
            {arch.diagrams.map((diag, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                    Diagram #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDiagram(idx)}
                    className="text-[var(--text-muted)] hover:text-[var(--error)] p-1 rounded"
                    title="Remove diagram"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Image URL"
                    value={diag.url || ""}
                    onChange={(e) => updateDiagram(idx, "url", e.target.value)}
                    placeholder="https://... or uploaded data URL"
                  />
                  <Input
                    label="Caption"
                    value={diag.caption || ""}
                    onChange={(e) => updateDiagram(idx, "caption", e.target.value)}
                    placeholder="e.g. AWS Multi-AZ Network Topology"
                  />
                </div>

                <Input
                  label="Description / Context"
                  value={diag.description || ""}
                  onChange={(e) => updateDiagram(idx, "description", e.target.value)}
                  placeholder="e.g. Illustrates subnet boundaries and NAT gateway placement."
                />

                {diag.url && (
                  <div className="pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={diag.url}
                      alt={diag.caption || "Architecture"}
                      className="max-h-48 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-muted)]">
            No architecture diagrams attached yet. Click upload or add URL above.
          </div>
        )}
      </section>

      {/* Data Flow Narrative */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Data Flow Narrative</h3>
        <Textarea
          label="Detailed Data Flow Sequence"
          rows={4}
          value={arch.dataFlow || ""}
          onChange={(e) => updateArch("dataFlow", e.target.value)}
          placeholder="e.g. 1. External HTTPS requests arrive at Route 53 DNS.&#10;2. Traffic forwards to ALB in public subnets across AZ-A and AZ-B.&#10;3. ALB terminates TLS and proxies HTTP traffic to private EC2 instances."
        />
      </section>

      {/* Component Roles Table */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Infrastructure Components</h3>
            <p className="text-[13px] text-[var(--text-secondary)]">List individual components and their specific responsibilities.</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addComponent} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </Button>
        </div>

        {arch.components && arch.components.length > 0 ? (
          <div className="space-y-3">
            {arch.components.map((comp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface-2)]"
              >
                <div className="sm:col-span-4">
                  <Input
                    placeholder="Component Name (e.g. VPC)"
                    value={comp.name || ""}
                    onChange={(e) => updateComponent(idx, "name", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    placeholder="Role (e.g. Isolated Network Boundary)"
                    value={comp.role || ""}
                    onChange={(e) => updateComponent(idx, "role", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    placeholder="Service (e.g. AWS EC2)"
                    value={comp.service || ""}
                    onChange={(e) => updateComponent(idx, "service", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeComponent(idx)}
                    className="text-[var(--text-muted)] hover:text-[var(--error)] p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] text-[13px] text-[var(--text-muted)]">
            No components listed yet. Click &quot;Add Component&quot; to break down architecture services.
          </div>
        )}
      </section>
    </div>
  );
}
