import React from "react";
import Link from "next/link";
import { Terminal, ExternalLink } from "lucide-react";

const LINKS = [
  {
    heading: "Platform",
    items: [
      { label: "Lab Catalog", href: "/courses" },
      { label: "Learning Paths", href: "/courses" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Architecture Guide", href: "/ARCHITECTURE.md", external: true },
      { label: "GitHub", href: "https://github.com/hygianno/syntaxops", external: true },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--border)]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-6 h-6 rounded-[5px] bg-[var(--accent)] flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </div>
              <span className="font-mono font-semibold text-[14px] text-[var(--text-primary)]">
                syntax_ops
              </span>
            </Link>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-[200px]">
              Proof of Work engineering education for African cloud and software talent.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                    >
                      {item.label}
                      {item.external && <ExternalLink className="w-3 h-3 opacity-60" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[var(--text-muted)]">
            © 2026 Syntax_Ops. Built by{" "}
            <span className="text-[var(--text-secondary)] font-medium">Folarin Favour Olaoluwapo</span>.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)]">
            <span>HMAC Proof of Work</span>
            <span>·</span>
            <span>$0 Egress Architecture</span>
            <span>·</span>
            <span>Paystack Pan-African</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
