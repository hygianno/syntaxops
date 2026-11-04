import React from "react";
import { ShieldCheck, Award, CheckCircle } from "lucide-react";
import { formatCredentialId } from "@/lib/hmac";

export default function CertificateBadge({ verificationHash, studentName, courseTitle }) {
  const credentialId = formatCredentialId(verificationHash);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-md)] text-center">
      {/* Subtle top accent gradient */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{
          background: "linear-gradient(90deg, var(--accent) 0%, var(--success) 100%)",
        }}
      />

      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--border)] flex items-center justify-center">
        <Award className="w-7 h-7 text-[var(--accent)] stroke-[2.2]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success-subtle)] border border-[var(--success-border)] text-[var(--success)] text-[12px] font-semibold mb-3">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Verified Proof of Work</span>
      </div>

      <h2 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
        {studentName}
      </h2>

      <p className="text-[14px] text-[var(--text-secondary)] max-w-lg mx-auto mb-6 leading-relaxed">
        Has successfully provisioned, verified, and audited all engineering milestones for:
        <span className="block text-[var(--text-primary)] font-semibold mt-1">
          {courseTitle}
        </span>
      </p>

      {/* Credential ID Hash Block */}
      <div className="inline-block bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-2.5">
        <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-0.5">
          Verification Identifier
        </div>
        <div className="text-[13px] font-mono font-bold text-[var(--accent-text)] tracking-wider">
          {credentialId}
        </div>
      </div>
    </div>
  );
}
