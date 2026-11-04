"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Sparkles, Terminal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function NewCoursePage() {
  const router = useRouter();
  const addToast = useToast();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [track, setTrack] = useState("Cloud & DevOps");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          track,
          level,
        }),
      });

      const data = await res.json();
      if (data.success && data.course) {
        if (addToast) addToast({ message: "Project created! Opening Course Studio...", type: "success" });
        router.push(`/admin/courses/${data.course._id || data.course.slug}/edit`);
      } else {
        alert("Failed to create project: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Create course error:", err);
      alert("Error creating project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Studio</span>
            </Link>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
              Initialize New Engineering Project
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Start a new technical project draft. You can add modular content blocks, architecture diagrams, and sanity quizzes once initialized.
            </p>
          </div>

          <form onSubmit={handleCreate} className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-5 shadow-[var(--shadow-sm)]">
            <Input
              label="Project Title"
              placeholder="e.g. Build and Deploy Cloud Infrastructure on AWS Using Pulumi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              helperText="Focus on concrete, hands-on production engineering deliverables."
            />

            <Textarea
              label="Short Summary"
              rows={3}
              placeholder="e.g. Provision multi-tier cloud infrastructure, automate security group rules, and verify canary rollouts."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              helperText="Brief summary displayed on project cards and search listings."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-[var(--text-primary)] block mb-1.5">
                  Discipline Track
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                >
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Full-Stack Web Dev">Full-Stack Web Dev</option>
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="Linux & Networking">Linux & Networking</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[var(--text-primary)] block mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
              <Link href="/admin/courses">
                <Button variant="ghost" size="md">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md" isLoading={loading} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Create & Open Studio</span>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
