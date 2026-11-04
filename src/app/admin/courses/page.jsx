"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Layers,
  Clock,
  Coins,
  ShieldCheck,
  Edit,
  Eye,
  Copy,
  Archive,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  Terminal,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatCurrencyNGN } from "@/lib/utils";

export default function AdminCoursesDashboard() {
  const router = useRouter();
  const addToast = useToast();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTrack, setNewTrack] = useState("Cloud & DevOps");
  const [newLevel, setNewLevel] = useState("Beginner");
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses?status=${statusFilter}&track=${trackFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin courses:", err);
      if (addToast) addToast({ message: "Failed to load courses", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, trackFilter, search]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          track: newTrack,
          level: newLevel,
        }),
      });

      const data = await res.json();
      if (data.success && data.course) {
        if (addToast) addToast({ message: "Draft project created!", type: "success" });
        setIsCreateModalOpen(false);
        router.push(`/admin/courses/${data.course._id || data.course.slug}/edit`);
      } else {
        alert("Failed to create project: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Create course error:", err);
      alert("Error creating project: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (addToast) addToast({ message: "Project duplicated as draft!", type: "success" });
        fetchCourses();
      } else {
        alert("Duplication failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Duplicate error:", err);
    }
  };

  const handleTogglePublish = async (course) => {
    const nextStatus = course.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/courses/${course._id || course.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (addToast) {
          addToast({
            message: `Project ${nextStatus === "published" ? "published live to catalog!" : "reverted to draft."}`,
            type: "success",
          });
        }
        fetchCourses();
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (addToast) addToast({ message: "Project deleted.", type: "info" });
        fetchCourses();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] text-[12px] font-semibold mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>Syntax_Ops Course Studio</span>
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
                Project Authoring & Management
              </h1>
              <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-2xl">
                Create, author, and publish practical technical projects for Syntax_Ops engineers.
                Dynamic content blocks, autograded assessments, and automated PDF dossier compilation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </Button>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Total Projects
              </div>
              <div className="text-[24px] font-bold text-[var(--text-primary)]">{stats.total}</div>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Published
              </div>
              <div className="text-[24px] font-bold text-[var(--success)]">{stats.published}</div>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Drafts
              </div>
              <div className="text-[24px] font-bold text-[var(--warning)]">{stats.draft}</div>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <div className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Archived
              </div>
              <div className="text-[24px] font-bold text-[var(--text-muted)]">{stats.archived}</div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title, summary, or slug..."
                className="w-full pl-9 pr-3 py-2 text-[13px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-[13px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="px-3 py-2 text-[13px] bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] focus:outline-none"
              >
                <option value="all">All Tracks</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Full-Stack Web Dev">Full-Stack Web Dev</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Linux & Networking">Linux & Networking</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Project List / Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--border)] border-t-[var(--accent)] mx-auto" />
              <p className="text-[13px] text-[var(--text-muted)]">Loading Course Studio projects...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-3">
              {courses.map((course) => {
                const id = course._id || course.slug;
                const statusColor =
                  course.status === "published"
                    ? "bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success-border)]"
                    : course.status === "archived"
                    ? "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]"
                    : "bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning-border)]";

                return (
                  <div
                    key={id}
                    className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-[var(--shadow-sm)] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Project Metadata Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusColor}`}>
                          {course.status || "draft"}
                        </span>
                        <span className="text-[12px] font-medium text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-[4px]">
                          {course.track}
                        </span>
                        <span className="text-[12px] text-[var(--text-muted)]">•</span>
                        <span className="text-[12px] text-[var(--text-secondary)]">{course.level}</span>
                        <span className="text-[12px] text-[var(--text-muted)]">•</span>
                        <span className="text-[12px] text-[var(--text-secondary)] font-mono">
                          {formatCurrencyNGN(course.priceNGN)}
                        </span>
                      </div>

                      <h3 className="text-[16px] font-bold text-[var(--text-primary)] truncate">
                        {course.title}
                      </h3>

                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 max-w-3xl leading-relaxed">
                        {course.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--text-muted)] pt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {course.steps?.length || 0} Milestones
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.estimatedDuration || `${course.estimatedHours || 2}h`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-[var(--warning)]" />
                          Build Cost: ${course.buildCost?.min ?? 0}–${course.buildCost?.max ?? 0}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          Slug: /{course.slug}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                      <Link href={`/admin/courses/${id}/edit`}>
                        <Button variant="secondary" size="sm" className="gap-1.5">
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>
                      </Link>

                      <Link href={`/admin/courses/${id}/preview`}>
                        <Button variant="ghost" size="sm" className="gap-1.5" title="Preview learner view">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(course)}
                        title={course.status === "published" ? "Unpublish to draft" : "Publish to live catalog"}
                        className={course.status === "published" ? "text-[var(--warning)]" : "text-[var(--success)]"}
                      >
                        {course.status === "published" ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(id)}
                        title="Duplicate as new draft"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(id, course.title)}
                        className="text-[var(--error)] hover:bg-[var(--error-subtle)]"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)]">
              <Layers className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
              <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
                No technical projects found
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mx-auto mb-4">
                Create a new hands-on engineering project or adjust your filters.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Create New Project</span>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Engineering Project"
        description="Initialize a structured project in Syntax_Ops Course Studio."
        size="md"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 mt-2">
          <Input
            label="Project Title"
            placeholder="e.g. Build and Deploy Cloud Infrastructure Using Pulumi"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            helperText="Clear, production-focused engineering objective."
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-[var(--text-primary)] block mb-1.5">
                Discipline Track
              </label>
              <select
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
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
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full h-9 px-3 rounded-[6px] text-[13px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border)]">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={creating}>
              Create & Launch Studio
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
