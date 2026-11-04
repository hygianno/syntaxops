"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { formatCredentialId } from "@/lib/hmac";

export default function PortfolioHubPage() {
  const [submissions, setSubmissions] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("syntaxops:user_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }

      const list = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("syntaxops:submission:")) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            list.push(data);
          } catch (e) {}
        }
      }

      // If empty in local dev, provide standard showcase preview
      if (list.length === 0) {
        list.push({
          submissionId: "demo-aws-vpc-01",
          courseTitle: "Production-Grade AWS VPC Network Architecture",
          track: "Cloud & DevOps",
          level: "Intermediate",
          userFullName: profile?.fullName || "Folarin Favour Olaoluwapo",
          completedAt: new Date().toISOString(),
          verificationHash: "4f7a3e819b2c4d6a8e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
          stepResponses: [
            {
              stepNumber: 1,
              title: "VPC Topology & Dual-AZ Subnet Allocation",
              reflectionText:
                "Carved out a /16 CIDR block into isolated public load balancer subnets and private application tiers across 2 availability zones.",
              quizPassed: true,
            },
            {
              stepNumber: 2,
              title: "Internet Gateway & Route Table Isolation",
              reflectionText:
                "Configured strict default route targets ensuring private subnets never have direct ingress from 0.0.0.0/0.",
              quizPassed: true,
            },
          ],
        });
      }

      setSubmissions(list);
    } catch (e) {
      console.error("Portfolio list error:", e);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-[var(--border)]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] text-[12px] font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Engineering Portfolio Hub</span>
            </div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
              {profile ? `${profile.fullName}'s Engineering Portfolio` : "Engineering Portfolios"}
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-2xl">
              Authentic, auditable project completion dossiers generated with client-side vector compilation
              and cryptographically bound with HMAC SHA-256 verification hashes.
            </p>
          </div>

          {/* Grid of portfolios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map((sub, idx) => {
              const credId = formatCredentialId(sub.verificationHash);
              return (
                <div
                  key={sub.submissionId || idx}
                  className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-[4px] font-semibold">
                        {credId}
                      </span>
                      <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Audited
                      </span>
                    </div>

                    <h2 className="text-[17px] font-bold text-[var(--text-primary)] leading-snug">
                      {sub.courseTitle}
                    </h2>

                    <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                      <span>{sub.track}</span>
                      <span>•</span>
                      <span>{sub.level}</span>
                      <span>•</span>
                      <span>{sub.stepResponses?.length || 0} Milestones</span>
                    </div>

                    <p className="text-[13px] text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                      {sub.stepResponses?.[0]?.reflectionText || "Production engineering project completion."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[12px] text-[var(--text-muted)]">
                      Engineer: <strong className="text-[var(--text-primary)]">{sub.userFullName}</strong>
                    </span>
                    <Link href={`/portfolio/${sub.submissionId}`}>
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <span>Inspect Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
