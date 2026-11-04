"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Shield, BookOpen, User, CheckCircle2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("syntaxops:user_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setName(parsed.fullName || "");
        setEmail(parsed.email || "");
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newProfile = {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("syntaxops:user_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Ethos */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-base tracking-tight text-slate-100 flex items-center gap-1.5">
                SYNTAX<span className="text-cyan-400">_OPS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-sans font-semibold uppercase tracking-wider">
                  PoW
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                African Cloud & DevOps Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/courses"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lab Catalog</span>
            </Link>

            {/* Profile Action Pill */}
            {profile ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-200 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{profile.fullName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-medium text-cyan-300 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Set Engineer Profile</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Guest Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Engineer Identity & Dossier Binding"
        description="Your name and email will be bound to your verified project completion dossiers and cryptographic Proof of Work certificates."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Legal / Engineering Name"
            placeholder="e.g. Folarin Favour Olaoluwapo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            helperText="Appears on official verified completion certificates"
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. folarin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText="Used for enrollment records and portfolio verification links"
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Engineer Identity
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
