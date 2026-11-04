import Link from "next/link";
import {
  ArrowRight, Terminal, ShieldCheck, FileText,
  Clock, Layers, CheckCircle, ChevronRight,
  Cloud, Server, Code2, Bot, Network
} from "lucide-react";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockCourses } from "@/data/mockCourses";
import { formatCurrencyNGN } from "@/lib/utils";

/* ─── How It Works ──────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose a real engineering project",
    body: "Browse curated lab projects across AWS, Kubernetes, Linux, DevOps, and full-stack development. Each project solves a real-world engineering problem.",
    icon: Layers,
  },
  {
    step: "02",
    title: "Build it in your own environment",
    body: "No synthetic sandboxes. You execute real infrastructure on your own AWS account, local machine, or Kubernetes cluster — confronting authentic failure modes.",
    icon: Terminal,
  },
  {
    step: "03",
    title: "Prove what you built",
    body: "Submit terminal outputs, cloud console screenshots, written reflections, and pass a targeted quiz at each milestone before progressing.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Export a verified dossier",
    body: "Your browser compiles a PDF project report with your reflections, proofs, and a cryptographic verification hash — ready to share with employers.",
    icon: FileText,
  },
];

/* ─── Tracks ────────────────────────────────────────────────── */
const TRACKS = [
  { name: "Cloud Engineering & AWS",   icon: Cloud,   count: 3  },
  { name: "DevOps & Infrastructure",   icon: Server,  count: 2  },
  { name: "Linux & Networking",        icon: Network, count: 2  },
  { name: "Full-Stack Development",    icon: Code2,   count: 4  },
  { name: "AI & Automation",          icon: Bot,     count: 2  },
];

/* ─── Track badge colours ────────────────────────────────────── */
const TRACK_COLORS = {
  "Cloud & DevOps":    "text-blue-400   bg-blue-500/10  border-blue-500/20",
  "Full-Stack Web Dev":"text-violet-400 bg-violet-500/10 border-violet-500/20",
  "AI & Automation":  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const LEVEL_COLORS = {
  Beginner:     "text-[var(--success)] bg-[var(--success-subtle)]",
  Intermediate: "text-[var(--warning)] bg-[var(--warning-subtle)]",
  Advanced:     "text-[var(--error)]   bg-[var(--error-subtle)]",
};

/* ─── Page Component ─────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle radial on dark bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,103,232,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[13px] text-[var(--text-secondary)] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
            <span>Now live · Proof of Work certification for African engineers</span>
          </div>

          <h1 className="text-[42px] sm:text-[56px] font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] mb-6">
            Stop watching tutorials.{" "}
            <span className="text-[var(--accent)]">
              Start building real engineering skills.
            </span>
          </h1>

          <p className="text-[17px] sm:text-[18px] text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-10">
            Learn cloud engineering, DevOps, and software development through practical
            projects, real-world challenges, and verifiable proof of work.
            Built for the next generation of African cloud engineers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses">
              <Button variant="primary" size="lg" className="gap-2">
                Explore Learning Paths
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[13px] text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>Free foundational labs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>Paystack NGN billing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              <span>Cryptographic proof certificates</span>
            </div>
          </div>
        </div>

        {/* Workspace Preview */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div
            className="rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-lg)]"
            style={{ background: "var(--surface)" }}
          >
            {/* Mock window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
              <div className="w-3 h-3 rounded-full bg-[var(--error)] opacity-70" />
              <div className="w-3 h-3 rounded-full bg-[var(--warning)] opacity-70" />
              <div className="w-3 h-3 rounded-full bg-[var(--success)] opacity-70" />
              <div className="ml-3 flex-1 h-6 bg-[var(--surface-3)] rounded-[4px] max-w-xs text-[11px] text-[var(--text-muted)] flex items-center px-2">
                syntaxops.vercel.app/learn/production-aws-vpc
              </div>
            </div>
            {/* Split pane preview */}
            <div className="grid grid-cols-2 divide-x divide-[var(--border)]" style={{ minHeight: 280 }}>
              {/* Left — instructions */}
              <div className="p-5 space-y-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Step 1 of 3 · VPC Architecture
                </div>
                <div className="text-[15px] font-semibold text-[var(--text-primary)]">
                  Provision Your Production VPC
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Create a multi-AZ VPC with strict subnet isolation. Public subnets handle
                  ingress load balancers; private subnets run your application tier.
                </p>
                {/* Code block mockup */}
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] p-3 font-mono text-[11px] text-[var(--accent-text)]">
                  <div className="text-[var(--text-muted)] mb-1 text-[10px]">bash</div>
                  <div>aws ec2 create-vpc \</div>
                  <div className="pl-4 text-[var(--text-muted)">  --cidr-block 10.0.0.0/16 \</div>
                  <div className="pl-4 text-[var(--text-muted)">  --tag-specifications ...</div>
                </div>
              </div>
              {/* Right — notebook */}
              <div className="p-5 space-y-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Your Notebook
                </div>
                <div className="text-[13px] text-[var(--accent)] font-mono bg-[var(--accent-subtle)] border border-[var(--accent)]/20 rounded-[6px] p-2 leading-snug">
                  &gt; Why do we separate public and private subnets?
                </div>
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--text-muted)] h-16 flex items-start">
                  <span className="opacity-60">Write your architectural reasoning here…</span>
                </div>
                {/* Upload area */}
                <div className="border-2 border-dashed border-[var(--border)] rounded-[6px] p-3 text-center">
                  <p className="text-[11px] text-[var(--text-muted)]">Upload terminal screenshot</p>
                </div>
                {/* Complete button */}
                <div className="pt-1">
                  <div className="h-8 bg-[var(--accent)] opacity-30 rounded-[6px] w-32 ml-auto" />
                </div>
              </div>
            </div>
          </div>
          {/* Gradient fade at bottom of preview */}
          <div
            className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--bg))",
            }}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
              How it works
            </p>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] leading-tight tracking-tight mb-4">
              A four-phase proof of work pipeline
            </h2>
            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
              Every engineering lab follows the same enforced workflow. You cannot skip steps
              or fake progress. Each milestone requires genuine proof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-6 border-t border-dashed border-[var(--border)] z-10" />
                  )}
                  <div className="p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-[6px] bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[var(--accent-text)]" />
                      </div>
                      <span className="text-[12px] font-mono font-bold text-[var(--text-muted)]">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">
                Active curriculum
              </p>
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
                Featured engineering labs
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              View all labs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mockCourses.map((course) => (
              <FeaturedCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING TRACKS ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
              Learning tracks
            </p>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
              Five engineering disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.name}
                  href="/courses"
                  className="group p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all duration-150"
                >
                  <div className="w-9 h-9 rounded-[8px] bg-[var(--surface-2)] flex items-center justify-center mb-3 group-hover:bg-[var(--accent-subtle)] transition-colors">
                    <Icon className="w-4.5 h-4.5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug mb-1">
                    {track.name}
                  </div>
                  <div className="text-[12px] text-[var(--text-muted)]">{track.count} labs</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROOF OF WORK EXPLANATION ────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
              Proof of work
            </p>
            <h2 className="text-[24px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-5">
              Credentials that survive technical scrutiny
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
              Traditional completion certificates prove nothing. Syntax_Ops generates a
              PDF project dossier containing your actual terminal outputs, architectural
              decisions, written analysis, and a cryptographic verification hash —
              evidence that withstands a technical interview.
            </p>
            <ul className="space-y-3">
              {[
                "Terminal output and cloud console screenshot evidence",
                "Minimum 20-word mandatory architectural reflection per step",
                "Targeted comprehension quiz at every milestone",
                "HMAC SHA-256 verification hash on every certificate",
                "Public portfolio link for direct recruiter sharing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-[var(--text-secondary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Certificate preview */}
          <div className="relative">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border)]">
                <div className="w-8 h-8 rounded-[6px] bg-[var(--accent)] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-white stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--text-primary)]">syntax_ops</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Proof of Work Dossier</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Credential ID</div>
                  <div className="font-mono text-[11px] text-[var(--accent-text)] font-semibold">SYNTAX-A1B2-C3D4</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
                  Production AWS VPC Network Architecture
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="px-2 py-0.5 rounded-full text-[var(--accent-text)] bg-[var(--accent-subtle)] font-medium">Cloud & DevOps</span>
                  <span className="px-2 py-0.5 rounded-full text-[var(--warning)] bg-[var(--warning-subtle)] font-medium">Intermediate</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="p-2 rounded-[6px] bg-[var(--surface-2)]">
                  <div className="text-[14px] font-bold text-[var(--text-primary)]">3</div>
                  <div className="text-[11px] text-[var(--text-muted)]">milestones</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[var(--surface-2)]">
                  <div className="text-[14px] font-bold text-[var(--success)]">100%</div>
                  <div className="text-[11px] text-[var(--text-muted)]">verified</div>
                </div>
                <div className="p-2 rounded-[6px] bg-[var(--surface-2)]">
                  <div className="text-[14px] font-bold text-[var(--text-primary)]">3h</div>
                  <div className="text-[11px] text-[var(--text-muted)]">execution</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-[6px] bg-[var(--success-subtle)] border border-[var(--success-border)]">
                <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0" />
                <span className="text-[12px] text-[var(--success)] font-medium">
                  Verified · Folarin Favour Olaoluwapo · Nov 4, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
            Ready to build real engineering skills?
          </h2>
          <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
            Start with a free foundational lab. No subscription required.
            Deploy real infrastructure, prove your work, export your dossier.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses">
              <Button variant="primary" size="lg">
                Browse Engineering Labs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Featured Course Card ───────────────────────────────────── */
function FeaturedCard({ course }) {
  const { slug, title, track, level, isPaid, priceNGN, summary, estimatedHours, steps = [] } = course;
  const trackColor = TRACK_COLORS[track] || "text-[var(--text-secondary)] bg-[var(--surface-2)] border-[var(--border)]";
  const levelColor = LEVEL_COLORS[level] || "text-[var(--text-muted)] bg-[var(--surface-2)]";

  return (
    <Link
      href={`/learn/${slug}`}
      className="group flex flex-col p-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200"
    >
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${trackColor}`}>{track}</span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelColor}`}>{level}</span>
        <span className="ml-auto text-[12px] font-semibold text-[var(--text-secondary)]">
          {formatCurrencyNGN(priceNGN)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-2 line-clamp-2">
        {title}
      </h3>

      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2 flex-1">
        {summary}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-[12px] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
        <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{steps.length} steps</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />~{estimatedHours}h</span>
        <span className="ml-auto flex items-center gap-1 text-[var(--accent)] font-medium group-hover:gap-2 transition-all">
          {isPaid ? "Unlock" : "Start free"} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
