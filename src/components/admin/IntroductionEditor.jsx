import React from "react";
import Input, { Textarea } from "@/components/ui/Input";

export default function IntroductionEditor({ course, onChange }) {
  const updateIntro = (field, value) => {
    onChange({
      ...course,
      introduction: {
        ...(course.introduction || {}),
        [field]: value,
      },
    });
  };

  const intro = course.introduction || {};

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Project Introduction</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
          Provide contextual framing and briefing resources before the learner begins Phase 1 execution.
        </p>
      </div>

      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Overview & Briefing</h3>

        <Textarea
          label="Comprehensive Project Introduction (Markdown)"
          rows={6}
          value={intro.markdown || ""}
          onChange={(e) => updateIntro("markdown", e.target.value)}
          placeholder="### Engineering Briefing&#10;&#10;In this project, you will act as a Lead Platform Engineer designing an enterprise multi-region network on AWS..."
          helperText="Markdown formatting with headers, code blocks, and lists is supported."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Optional Briefing Video URL (YouTube embed or MP4)"
            value={intro.videoUrl || ""}
            onChange={(e) => updateIntro("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/embed/xxxxxx"
          />
          <Input
            label="Video Description / Transcript Note"
            value={intro.videoDescription || ""}
            onChange={(e) => updateIntro("videoDescription", e.target.value)}
            placeholder="e.g. 3-minute architectural walkthrough of VPC ingress routing."
          />
        </div>
      </section>

      <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Deliverables & Final Outcomes</h3>

        <div className="space-y-4">
          <Textarea
            label="What You Will Build (Exact Tangible Output)"
            rows={3}
            value={intro.whatYouWillBuild || ""}
            onChange={(e) => updateIntro("whatYouWillBuild", e.target.value)}
            placeholder="e.g. An automated Terraform script provisioning dual-AZ VPC subnets, NAT gateways, and an Application Load Balancer."
          />

          <Textarea
            label="Why This Project Matters (Enterprise Relevance)"
            rows={3}
            value={intro.whyItMatters || ""}
            onChange={(e) => updateIntro("whyItMatters", e.target.value)}
            placeholder="e.g. Demonstrates hands-on knowledge of CIDR planning and network security boundaries to hiring managers."
          />

          <Textarea
            label="Expected Final Verification State"
            rows={3}
            value={intro.expectedResult || ""}
            onChange={(e) => updateIntro("expectedResult", e.target.value)}
            placeholder="e.g. A curl request to the public ALB returns HTTP 200 OK from the private EC2 instance."
          />
        </div>
      </section>
    </div>
  );
}
