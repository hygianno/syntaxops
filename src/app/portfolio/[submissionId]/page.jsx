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
  ExternalLink,
  Layers,
  Clock,
  Terminal,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CertificateBadge from "@/components/portfolio/CertificateBadge";
import ShareButtons from "@/components/portfolio/ShareButtons";
import { formatCredentialId } from "@/lib/hmac";

// Dynamically import the client-only PDF compilation button
const PDFExportButton = dynamic(
  () => import("@/components/portfolio/PDFExportButton"),
  {
    ssr: false,
    loading: () => (
      <div className="px-4 py-2 text-[13px] rounded-[6px] bg-[var(--surface-2)] text-[var(--text-muted)] animate-pulse">
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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3867E8", "#16845B", "#F5B731"],
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  const credentialId = formatCredentialId(submission.verificationHash);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Back to Catalog & Status Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lab Catalog</span>
            </Link>
            <span className="text-[12px] font-mono font-medium text-[var(--success)] flex items-center gap-1.5 bg-[var(--success-subtle)] px-2.5 py-1 rounded-full border border-[var(--success-border)]">
              <CheckCircle className="w-3.5 h-3.5" />
              All Milestones Audited & Verified
            </span>
          </div>

          {/* Verified Credential Badge Hero */}
          <CertificateBadge
            verificationHash={submission.verificationHash}
            studentName={submission.userFullName}
            courseTitle={submission.courseTitle}
          />

          {/* Action Bar: PDF Vector Download */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
            <div>
              <h2 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
                Verified Project Completion Dossier
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                Client-compiled vector PDF containing your architectural reflections,
                verified execution timestamps, and raw evidentiary proofs.
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
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] text-center space-y-3">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Share Your Proof of Work With Employers
            </div>
            <ShareButtons
              courseTitle={submission.courseTitle}
              credentialId={credentialId}
            />
          </div>

          {/* Submission Evidence Audit Details */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
                Audited Milestone Submissions
              </h2>
              <span className="text-[12px] text-[var(--text-muted)]">
                {submission.stepResponses?.length || 0} milestones submitted
              </span>
            </div>

            <div className="space-y-4">
              {submission.stepResponses?.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                      Milestone {step.stepNumber}: {step.title || `Step ${step.stepNumber}`}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-[var(--success)] px-2 py-0.5 rounded-full bg-[var(--success-subtle)] border border-[var(--success-border)]">
                      VERIFIED PASSED
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                      Cognitive Discovery Analysis
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-2)] p-3.5 rounded-[var(--radius-sm)] border border-[var(--border)]">
                      {step.reflectionText}
                    </p>
                  </div>

                  {step.screenshotUrl && (
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Terminal / Cloud Console Proof
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.screenshotUrl}
                        alt={`Milestone ${step.stepNumber} proof`}
                        className="max-h-72 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-3)] object-contain w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
