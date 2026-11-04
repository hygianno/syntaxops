"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  ArrowLeft,
  FileText,
  CheckCircle,
} from "lucide-react";
import CertificateBadge from "@/components/portfolio/CertificateBadge";
import ShareButtons from "@/components/portfolio/ShareButtons";
import { formatCredentialId } from "@/lib/hmac";

// Dynamically import the client-only PDF compilation button
const PDFExportButton = dynamic(
  () => import("@/components/portfolio/PDFExportButton"),
  {
    ssr: false,
    loading: () => (
      <div className="px-4 py-2 text-xs rounded-lg bg-slate-800 text-slate-400 animate-pulse">
        Initializing Vector PDF Engine...
      </div>
    ),
  }
);

export default function PortfolioReportPage({ params }) {
  const resolvedParams = use(params);
  const submissionId = resolvedParams.submissionId;

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Confetti celebration burst on load
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#3b82f6", "#10b981"],
      });
    } catch (e) {
      // Ignored in non-interactive runtimes
    }

    try {
      const stored = localStorage.getItem(`syntaxops:submission:${submissionId}`);
      if (stored) {
        setSubmission(JSON.parse(stored));
      } else {
        // Fallback demo submission if accessed directly
        setSubmission({
          submissionId,
          userFullName: "Demo Cloud Engineer",
          userEmail: "engineer@syntaxops.io",
          courseTitle: "Production-Grade AWS VPC Network Architecture",
          track: "Cloud & DevOps",
          level: "Intermediate",
          completedAt: new Date().toISOString(),
          verificationHash: "4f7a3e819b2c4d6a8e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
          stepResponses: [
            {
              stepNumber: 1,
              title: "VPC Topology & Dual-AZ Subnet Allocation",
              reflectionText:
                "Configured a non-overlapping 10.0.0.0/16 VPC block. Segregated public ingress into two availability zones and created dedicated private subnets for application workloads.",
              screenshotUrl: null,
              quizPassed: true,
            },
          ],
        });
      }
    } catch (e) {
      console.error("Failed to load submission:", e);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  if (loading || !submission) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }

  const credentialId = formatCredentialId(submission.verificationHash);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back to Catalog */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Labs Catalog</span>
        </Link>
        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> All Milestones Audited
        </span>
      </div>

      {/* Verified Credential Badge Hero */}
      <CertificateBadge
        verificationHash={submission.verificationHash}
        studentName={submission.userFullName}
        courseTitle={submission.courseTitle}
      />

      {/* Action Bar: PDF Vector Download + Social Share */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Client-Side Compiled Project Dossier
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Vector PDF containing your reflections, timestamps, and terminal proofs.
          </p>
        </div>

        <div className="shrink-0">
          <PDFExportButton
            submission={submission}
            credentialId={credentialId}
          />
        </div>
      </div>

      {/* Social Verification Sharing */}
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Broadcast Proof of Work
        </div>
        <ShareButtons
          courseTitle={submission.courseTitle}
          credentialId={credentialId}
        />
      </div>

      {/* Submission Evidence Audit Details */}
      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        <h3 className="text-base font-bold text-slate-100">
          Audited Milestone Submissions
        </h3>

        <div className="space-y-4">
          {submission.stepResponses?.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">
                  Milestone {step.stepNumber}: {step.title || `Step ${step.stepNumber}`}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                  PASSED
                </span>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono text-cyan-400 mb-1">
                  Cognitive Discovery Analysis:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                  {step.reflectionText}
                </p>
              </div>

              {step.screenshotUrl && (
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                    Terminal Execution Proof:
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.screenshotUrl}
                    alt={`Milestone ${step.stepNumber} proof`}
                    className="max-h-64 rounded-lg border border-slate-800 bg-black/40 object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
