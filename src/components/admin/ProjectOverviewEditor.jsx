import React from "react";
import Input, { Textarea } from "@/components/ui/Input";

export default function ProjectOverviewEditor({ course, onChange }) {
  const updateField = (field, value) => {
    onChange({ ...course, [field]: value });
  };

  const updateNested = (parent, field, value) => {
    onChange({
      ...course,
      [parent]: {
        ...(course[parent] || {}),
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Project Overview</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
          Define core project identity, real-world problem statement, pricing, and infrastructure costs.
        </p>
      </div>

      {/* Basic Metadata */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Basic Information</h3>

        <div className="space-y-4">
          <Input
            label="Project Title"
            value={course.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Production AWS VPC Network Architecture"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Slug"
              value={course.slug || ""}
              onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g. aws-vpc-production"
              helperText="Unique URL identifier: /learn/[slug]"
              required
            />
            <Input
              label="Technology Category"
              value={course.category || ""}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="e.g. AWS & Kubernetes, Terraform, Pulumi"
            />
          </div>

          <Textarea
            label="Short Summary"
            rows={2}
            value={course.summary || ""}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Brief 1-2 sentence pitch shown on project cards and search results."
          />

          <Textarea
            label="Full Description"
            rows={4}
            value={course.fullDescription || ""}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            placeholder="Comprehensive description of the project scope, technical context, and engineering deliverables."
          />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Real-World Problem Statement</h3>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Explain why this project matters in production engineering, avoiding artificial tutorial exercises.
        </p>

        <div className="space-y-4">
          <Textarea
            label="What specific problem does this solve?"
            rows={3}
            value={course.problemStatement?.whatProblem || ""}
            onChange={(e) => updateNested("problemStatement", "whatProblem", e.target.value)}
            placeholder="e.g. Modern cloud architectures require public/private subnet isolation to prevent direct exposure of backend workloads to the internet."
          />

          <Textarea
            label="Why is this important in enterprise systems?"
            rows={3}
            value={course.problemStatement?.whyImportant || ""}
            onChange={(e) => updateNested("problemStatement", "whyImportant", e.target.value)}
            placeholder="e.g. Misconfigured security groups or routing tables lead to data breaches, compliance failures, and compromised credentials."
          />

          <Textarea
            label="What will the engineer build?"
            rows={3}
            value={course.problemStatement?.whatWillBuild || ""}
            onChange={(e) => updateNested("problemStatement", "whatWillBuild", e.target.value)}
            placeholder="e.g. A multi-AZ VPC with public ingress subnets, private database tiers, and automated route tables."
          />
        </div>
      </section>

      {/* Target Audience & Prerequisites */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Target Audience</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="Who should take this project?"
            rows={3}
            value={course.targetAudience?.whoShouldTake || ""}
            onChange={(e) => updateNested("targetAudience", "whoShouldTake", e.target.value)}
            placeholder="e.g. Cloud Engineers, DevOps beginners, and transitioning backend developers."
          />
          <Textarea
            label="Expected Background"
            rows={3}
            value={course.targetAudience?.expectedBackground || ""}
            onChange={(e) => updateNested("targetAudience", "expectedBackground", e.target.value)}
            placeholder="e.g. Basic terminal navigation and understanding of IP addressing."
          />
        </div>
      </section>

      {/* Pricing & Infrastructure / Build Cost */}
      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-6">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Course Pricing</h3>
          <p className="text-[13px] text-[var(--text-secondary)]">Platform fee for enrolling in this project.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-[13px] font-medium text-[var(--text-primary)] block mb-1.5">
              Access Tier
            </label>
            <select
              value={course.isPaid ? "paid" : "free"}
              onChange={(e) => updateField("isPaid", e.target.value === "paid")}
              className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
            >
              <option value="free">Free Project</option>
              <option value="paid">Paid Project</option>
            </select>
          </div>

          {course.isPaid && (
            <>
              <Input
                label="Price (NGN ₦)"
                type="number"
                value={course.priceNGN || 0}
                onChange={(e) => updateField("priceNGN", Number(e.target.value))}
                placeholder="15000"
              />
              <Input
                label="Price (USD $)"
                type="number"
                value={course.priceUSD || 0}
                onChange={(e) => updateField("priceUSD", Number(e.target.value))}
                placeholder="10"
              />
            </>
          )}
        </div>

        <div className="pt-4 border-t border-[var(--border)] space-y-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
              Infrastructure / Build Cost (External Cloud Spend)
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Estimated out-of-pocket costs on AWS, GCP, or other cloud providers for learners completing the project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Min Cost ($ USD)"
              type="number"
              value={course.buildCost?.min ?? 0}
              onChange={(e) => updateNested("buildCost", "min", Number(e.target.value))}
              placeholder="0"
            />
            <Input
              label="Max Cost ($ USD)"
              type="number"
              value={course.buildCost?.max ?? 0}
              onChange={(e) => updateNested("buildCost", "max", Number(e.target.value))}
              placeholder="5"
            />
            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2 text-[13px] text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={course.buildCost?.freeTierSufficient ?? true}
                  onChange={(e) => updateNested("buildCost", "freeTierSufficient", e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>Free-tier resources sufficient</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Cost Explanation & Teardown Warning"
            rows={3}
            value={course.buildCost?.explanation || ""}
            onChange={(e) => updateNested("buildCost", "explanation", e.target.value)}
            placeholder="e.g. AWS Free Tier provides 750 hours of t2.micro EC2 and 5GB S3. Be sure to delete the NAT Gateway after testing to prevent hourly charges."
          />
        </div>
      </section>
    </div>
  );
}
