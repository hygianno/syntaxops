"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, User, BookOpen, Menu, X, LayoutDashboard, Compass, Users, Award, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Lab Catalog", href: "/courses" },
  { label: "My Learning", href: "/my-learning" },
  { label: "Portfolios", href: "/portfolio" },
  { label: "Community", href: "/community" },
  { label: "Studio", href: "/admin/courses", badge: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("syntaxops:user_profile");
      if (stored) {
        const p = JSON.parse(stored);
        setProfile(p);
        setName(p.fullName || "");
        setEmail(p.email || "");
      }
    } catch {}
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const p = { fullName: name.trim(), email: email.trim().toLowerCase() };
    localStorage.setItem("syntaxops:user_profile", JSON.stringify(p));
    setProfile(p);
    setIsModalOpen(false);
  };

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 h-14",
          "flex items-center border-b",
          "transition-all duration-200",
          scrolled
            ? "bg-[var(--bg)]/95 backdrop-blur-md border-[var(--border)]"
            : "bg-[var(--bg)] border-[var(--border)]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className={cn(
                "w-7 h-7 rounded-[6px] flex items-center justify-center",
                "bg-[var(--accent)] group-hover:bg-[var(--accent-hover)]",
                "transition-colors duration-150"
              )}
            >
              <Terminal className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="font-mono font-semibold text-[15px] text-[var(--text-primary)] tracking-tight">
              syntax_ops
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-[13px] font-medium inline-flex items-center gap-1.5",
                  "transition-colors duration-150",
                  pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/")
                    ? "bg-[var(--surface-2)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                )}
              >
                {link.label}
                {link.badge && (
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-[var(--accent)]/30 leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Profile + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {profile ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-[8px]",
                    "border border-[var(--border)]",
                    "bg-[var(--surface)] hover:bg-[var(--surface-2)]",
                    "text-[13px] text-[var(--text-primary)] font-medium",
                    "transition-colors duration-150 cursor-pointer"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {initials}
                  </div>
                  <span className="max-w-[120px] truncate">{profile.fullName}</span>
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Get started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-14 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="relative bg-[var(--surface)] border-b border-[var(--border)] px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-[var(--accent)]/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/settings"
              className="block px-3 py-2.5 rounded-[6px] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Settings
            </Link>
            <div className="pt-3 border-t border-[var(--border)] mt-3 flex flex-col gap-2">
              {profile ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-[6px] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-[11px] font-bold">
                    {initials}
                  </div>
                  {profile.fullName}
                </button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Get started free
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Your engineer profile"
        description="Your name and email are stored locally and appear on your verified project dossiers and certificates."
        size="sm"
      >
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <Input
            label="Full name"
            placeholder="Folarin Favour Olaoluwapo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            helperText="Printed on completion certificates"
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText="Used for verification hash generation"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save profile
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
