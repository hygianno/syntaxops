import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  Cpu,
  FileCheck2,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/catalog/CourseCard";
import { mockCourses } from "@/data/mockCourses";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Eliminating Tutorial Hell for African Engineers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
            Stop Watching Tutorials. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Prove Your Cloud Work.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The dual-pane active lab workspace for African DevOps and backend talent.
            Execute real code in your own AWS & Kubernetes accounts, submit auditable
            terminal proofs, and generate client-verified PDF project dossiers that hiring
            managers respect.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/courses">
              <Button size="lg" className="shadow-cyan-500/25">
                <span>Browse Engineering Labs</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/learn/production-aws-vpc-architecture">
              <Button size="lg" variant="secondary">
                <span>Launch Free AWS Lab</span>
              </Button>
            </Link>
          </div>

          {/* Value Props Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold text-lg mb-1">0%</div>
              <div className="text-xs text-slate-400 font-medium">Passive Videos</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-emerald-400 font-mono font-bold text-lg mb-1">100%</div>
              <div className="text-xs text-slate-400 font-medium">Real-Environment Execution</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-blue-400 font-mono font-bold text-lg mb-1">HMAC</div>
              <div className="text-xs text-slate-400 font-medium">Cryptographic Proof Dossiers</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-mono font-bold text-lg mb-1">Paystack</div>
              <div className="text-xs text-slate-400 font-medium">Pan-African Fiat Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Work Comparison */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Passive Tutorials vs. Syntax_Ops Proof of Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Why recruiters and technical leads disregard standard certificates of completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-rose-950/40 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Standard Video Course Platforms</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Passive watching in background tabs with zero failure exposure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Pre-configured instructor environments hide IAM and network bugs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Generic PDF badges with zero evidentiary signal for hiring teams.</span>
              </li>
            </ul>
          </div>

          {/* Syntax_Ops */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-950/20 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>The Syntax_Ops Engineering Standard</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deploy directly into your own AWS, Docker, or Kubernetes clusters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mandatory discovery reflections and real terminal logs per milestone.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Client-side compiled PDF Dossier containing verified technical proofs.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Labs Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              Active Curriculum
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Featured Engineering Labs</h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>View All Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
