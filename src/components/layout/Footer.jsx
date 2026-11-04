import React from "react";
import Link from "next/link";
import { Terminal, Shield, ExternalLink, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-10 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-mono font-bold text-slate-100">
                SYNTAX<span className="text-cyan-400">_OPS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Enforced Proof of Work (PoW) cloud and software engineering labs.
              Replacing passive tutorial consumption with real-environment execution,
              auditable terminal artifacts, and client-compiled verification dossiers.
            </p>
            <p className="text-[11px] text-slate-500">
              Designed for high-density engineering hubs in Lagos, Nairobi, Accra, Cape Town, and Kigali.
            </p>
          </div>

          {/* Core Tracks */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Active Tracks
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/courses" className="hover:text-cyan-400 transition-colors">
                  AWS Cloud & Networking
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-cyan-400 transition-colors">
                  Kubernetes & Argo Rollouts
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-cyan-400 transition-colors">
                  Container Security & Audits
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Verification */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Engineering Baseline
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>HMAC Proof of Work</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Client-Side PDF Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Paystack Pan-African Rails</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2026 Syntax_Ops. Built by{" "}
            <span className="text-slate-300 font-medium">Folarin Favour Olaoluwapo</span>.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Zero-Egress Architecture <Heart className="w-3 h-3 text-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
