import React from "react";
import { ShieldCheck, Award } from "lucide-react";
import { formatCredentialId } from "@/lib/hmac";

export default function CertificateBadge({ verificationHash, studentName, courseTitle }) {
  const credentialId = formatCredentialId(verificationHash);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border border-cyan-500/30 p-8 shadow-2xl text-center">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
        <Award className="w-8 h-8 text-slate-950 stroke-[2.2]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified Proof of Work</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mb-1">
        {studentName}
      </h2>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
        Has successfully provisioned, verified, and audited all production milestones for:
        <span className="block text-slate-200 font-semibold mt-1">{courseTitle}</span>
      </p>

      {/* Credential ID Hash Block */}
      <div className="inline-block bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
        <div className="text-[10px] uppercase font-mono text-slate-500">
          Verification Identifier
        </div>
        <div className="text-sm font-mono font-bold text-cyan-400 tracking-wider">
          {credentialId}
        </div>
      </div>
    </div>
  );
}
