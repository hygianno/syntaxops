"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Key,
  Database,
  Trash2,
  CheckCircle,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const addToast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("syntaxops:user_profile");
      if (stored) {
        const p = JSON.parse(stored);
        setName(p.fullName || "");
        setEmail(p.email || "");
      }
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    } catch (e) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const p = {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("syntaxops:user_profile", JSON.stringify(p));
    if (addToast) {
      addToast({ message: "Settings saved successfully.", type: "success" });
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleClearDrafts = () => {
    if (confirm("Are you sure you want to clear your local workspace drafts? Completed submissions will remain.")) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("syntaxops:draft:")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      if (addToast) {
        addToast({ message: "Workspace drafts cleared.", type: "info" });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="pb-6 border-b border-[var(--border)]">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Manage your engineering profile, local workspace cache, and theme display.
            </p>
          </div>

          {/* Profile Form */}
          <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-[var(--accent)]" />
              <span>Engineer Identity Binding</span>
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              This information is cryptographically bound into your PDF completion dossiers.
            </p>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <Input
                label="Full Engineering Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folarin Favour Olaoluwapo"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="folarin@syntaxops.io"
                required
              />
              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="md" className="gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </section>

          {/* Theme Display */}
          <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                {theme === "dark" ? <Moon className="w-4.5 h-4.5 text-[var(--accent)]" /> : <Sun className="w-4.5 h-4.5 text-[var(--warning)]" />}
                <span>Interface Theme</span>
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                Toggle between dark mode (default) and light mode.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={toggleTheme} className="gap-2">
              {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </Button>
          </section>

          {/* Local Storage & Cache */}
          <section className="p-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-[var(--text-muted)]" />
              <span>Local Storage Management</span>
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Syntax_Ops writes keystrokes to your local browser storage to guarantee zero data loss during network drops.
            </p>
            <div className="pt-2">
              <Button variant="destructive" size="sm" onClick={handleClearDrafts} className="gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear Drafts Cache</span>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
