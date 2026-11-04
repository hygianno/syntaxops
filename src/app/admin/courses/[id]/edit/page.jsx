"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import CourseStudioLayout from "@/components/admin/CourseStudioLayout";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CourseEditorPage({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
        } else {
          setError(data.error || "Failed to load project details");
        }
      } catch (err) {
        console.error("Load course error:", err);
        setError("Error connecting to studio backend.");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border)] border-t-[var(--accent)] mx-auto" />
          <p className="text-[13px] text-[var(--text-muted)] font-mono">Initializing Course Studio workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
        <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] max-w-md text-center space-y-4">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Project Not Found</h2>
          <p className="text-[13px] text-[var(--text-secondary)]">{error || "Could not retrieve project data."}</p>
          <Link href="/admin/courses">
            <Button variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Studio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <CourseStudioLayout initialCourse={course} courseId={course._id || course.slug} />;
}
