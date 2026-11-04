"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const DISCUSSIONS = [
  {
    id: 1,
    tag: "AWS VPC Architecture",
    title: "Encountered IP exhaustion when creating dual-AZ private subnets with /24 CIDR blocks",
    author: "Emeka O.",
    role: "DevOps Engineer, Lagos",
    replies: 7,
    solved: true,
    time: "2 hours ago",
    summary:
      "When planning your subnet CIDR blocks in 10.0.0.0/16, make sure you allocate enough headroom for future database and load balancer subnets.",
  },
  {
    id: 2,
    tag: "Kubernetes & Argo",
    title: "Best practice for automated metric rollback using Prometheus error rate thresholds?",
    author: "Amina K.",
    role: "Platform Engineer, Nairobi",
    replies: 12,
    solved: false,
    time: "5 hours ago",
    summary:
      "Looking for sample AnalysisTemplate YAML definitions that monitor HTTP 5xx error rate percentages over a 5-minute canary window.",
  },
  {
    id: 3,
    tag: "Docker Hardening",
    title: "Why Distroless Node.js images break native node-gyp bindings and how to fix multi-stage copy",
    author: "Kwame A.",
    role: "Backend Architect, Accra",
    replies: 9,
    solved: true,
    time: "1 day ago",
    summary:
      "Make sure you run npm ci --only=production in the build stage and copy only node_modules into the distroless runtime stage to avoid missing shared C libraries.",
  },
];

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] text-[12px] font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>African Cloud Engineer Community</span>
              </div>
              <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
                Peer Engineering Discussions
              </h1>
              <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-2xl">
                Collaborate on real infrastructure failure modes, share verified lab solutions,
                and debug IAM, Kubernetes, and network configs together.
              </p>
            </div>

            <div>
              <Button variant="primary" size="md">
                <span>Start Discussion</span>
              </Button>
            </div>
          </div>

          {/* Discussion feed */}
          <div className="space-y-4">
            {DISCUSSIONS.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-[var(--shadow-sm)] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] font-medium">
                      {item.tag}
                    </span>
                    {item.solved && (
                      <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Solved
                      </span>
                    )}
                  </div>
                  <span className="text-[var(--text-muted)]">{item.time}</span>
                </div>

                <h3 className="text-[16px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors cursor-pointer">
                  {item.title}
                </h3>

                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {item.summary}
                </p>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                  <span>
                    Posted by <strong className="text-[var(--text-primary)]">{item.author}</strong> ({item.role})
                  </span>
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{item.replies} responses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
