import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  GitBranch,
  Lock,
  Search,
  ShieldCheck,
  TrendingDown,
  Zap,
} from "lucide-react";
import { LogoLockup, LogoMark } from "./brand";
import PublicAuditForm from "./public-audit-form";

const trustPoints = [
  "Public repo preview in seconds",
  "Private audits through GitHub OAuth",
  "Source code read for analysis only",
  "Seller reports built for sharing",
];

const checks = [
  {
    icon: ShieldCheck,
    title: "Security posture",
    body: "Credential exposure, auth gaps, dangerous runtime execution, dependency risk, and route protection.",
  },
  {
    icon: GitBranch,
    title: "Handoff readiness",
    body: "Runtime pins, lockfiles, environment documentation, CI signals, and deployment repeatability.",
  },
  {
    icon: Clock,
    title: "Remediation cost",
    body: "Engineering hours, dollar proxy, and the fixes most likely to become closing conditions.",
  },
  {
    icon: TrendingDown,
    title: "Deal leverage",
    body: "Buyer-ready language for holdbacks, price adjustments, and post-close technical work.",
  },
];

const plans = [
  {
    name: "Public Preview",
    price: "$0",
    body: "A real static scan for public GitHub repositories.",
    items: ["Live GitHub API scan", "Risk score", "Top findings", "Debt estimate"],
    href: "#free-audit",
    cta: "Try preview",
  },
  {
    name: "Seller Report",
    price: "$49",
    body: "Proof for listings, buyer calls, and diligence requests.",
    items: ["Private repo coverage", "Security findings", "Quality scores", "Shareable report link"],
    href: "/dashboard",
    cta: "Create seller report",
    featured: true,
  },
  {
    name: "Buyer Audit",
    price: "$79",
    body: "Acquisition diligence before an LOI, wire, or migration.",
    items: ["Everything in Seller", "Risk recommendation", "Hidden cost projection", "Negotiation summary"],
    href: "/dashboard",
    cta: "Start buyer audit",
  },
];

const blogPosts = [
  {
    title: "The micro-SaaS diligence checklist buyers actually need",
    category: "Acquisition playbook",
    readTime: "6 min read",
    body: "A practical checklist for auth, billing, deployment, data access, and ownership risk before signing an LOI.",
  },
  {
    title: "How technical debt changes valuation in a small SaaS deal",
    category: "Valuation",
    readTime: "5 min read",
    body: "Translate source-code findings into remediation hours, holdbacks, and price adjustments without turning diligence into theater.",
  },
  {
    title: "What sellers should fix before listing a software business",
    category: "Seller prep",
    readTime: "7 min read",
    body: "Reduce buyer objections with cleaner environment docs, reproducible builds, dependency hygiene, and shareable proof.",
  },
];

const faqs = [
  {
    question: "Does DueDev store source code?",
    answer: "No. Repo files are read to generate the report. The saved record contains findings, scores, and report metadata.",
  },
  {
    question: "Can it audit private repositories?",
    answer: "Yes. Private audits use GitHub OAuth so the user can select repositories they can access.",
  },
  {
    question: "What happens after Stripe checkout?",
    answer: "Stripe redirects to the audit page while the webhook marks the audit paid and starts the report generation job.",
  },
  {
    question: "Is the free preview the full audit?",
    answer: "No. The preview scans public files for fast screening. Paid audits are built for private repos and stored report history.",
  },
  {
    question: "Who is this for?",
    answer: "Buyers, sellers, operators, and advisors working through small SaaS acquisitions where code risk affects price and trust.",
  },
];

function HeroReportAnimation() {
  return (
    <div className="hero-console card-border relative min-w-0 max-w-[358px] overflow-hidden rounded-lg p-5 sm:max-w-full">
      <div className="scan-line" />
      <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-9 w-9" animated />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Live diligence</p>
            <p className="text-sm text-zinc-400">acme/ledger-app</p>
          </div>
        </div>
        <div className="shrink-0 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
          Running
        </div>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-[0.72fr_1fr]">
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Risk score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-6xl font-semibold leading-none text-orange-200">57</span>
            <span className="pb-2 text-sm text-zinc-500">/100</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">High leverage issues found in auth, env setup, and tests.</p>
        </div>

        <div className="min-w-0 space-y-3">
          {[
            ["Security", "76%", "bg-emerald-300"],
            ["Dependencies", "64%", "bg-cyan-300"],
            ["Handoff", "43%", "bg-orange-300"],
          ].map(([label, width, color]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-300">{label}</span>
                <span className="text-zinc-500">{width}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-md bg-white/10">
                <div className={`hero-bar h-full rounded-md ${color}`} style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ["27 files", "sampled"],
          ["18 hrs", "estimated fix"],
          ["$2,700", "cost proxy"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-lg font-semibold text-white">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-orange-300/20 bg-orange-300/10 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-200" />
          <p className="text-sm leading-6 text-orange-50">Missing environment docs should be scoped before handoff.</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080a09] text-white">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#080a09]/88 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <LogoLockup animated markClassName="h-9 w-9" />
          <div className="hidden items-center gap-6 lg:flex">
            <Link href="#free-audit" className="text-sm text-zinc-400 transition hover:text-white">
              Preview
            </Link>
            <Link href="#checks" className="text-sm text-zinc-400 transition hover:text-white">
              Checks
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-400 transition hover:text-white">
              Pricing
            </Link>
            <Link href="#blog" className="text-sm text-zinc-400 transition hover:text-white">
              Blog
            </Link>
            <Link href="#faq" className="text-sm text-zinc-400 transition hover:text-white">
              FAQ
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="hidden min-h-10 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-black transition hover:bg-emerald-300 sm:inline-flex"
          >
            Full audit
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80"
          alt="Professional diligence workspace with financial documents and laptop"
          className="absolute inset-0 h-full w-full object-cover opacity-24"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a09]/72 via-[#080a09]/88 to-[#080a09]" />
        <div className="relative mx-auto grid min-w-0 max-w-6xl gap-10 px-4 pb-14 pt-20 sm:pb-20 sm:pt-28 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div className="min-w-0 max-w-[358px] sm:max-w-full">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-100">
              <Zap className="h-3.5 w-3.5" />
              Technical due diligence for micro-SaaS deals
            </div>
            <h1 className="max-w-[358px] break-words text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:max-w-full sm:text-6xl lg:text-7xl">
              Find the code risk before the money moves.
            </h1>
            <p className="mt-6 max-w-[358px] text-lg leading-8 text-zinc-300 sm:max-w-2xl">
              Screen a public repo instantly, then run a private audit for acquisition risk, hidden debt, and seller-ready proof.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#free-audit"
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-400 px-6 text-base font-semibold text-black transition hover:bg-emerald-300"
              >
                Run free preview
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/15 bg-black/20 px-6 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Audit private repo
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-6 text-base font-semibold text-emerald-100 transition hover:border-emerald-300/45 hover:bg-emerald-300/15"
              >
                Sample report
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <HeroReportAnimation />

          <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-3">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-300" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <PublicAuditForm />
      </section>

      <section id="checks" className="border-y border-white/10 bg-white/[0.02] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">What gets checked</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Signals that change a deal conversation.
            </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Each report turns repository evidence into practical diligence language for buyers, sellers, and operators.
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            The free audit is real: it samples public GitHub files through the GitHub API and runs deterministic static checks. The paid audit adds authenticated private repo access, AI-assisted review, saved report history, and shareable seller links.
          </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {checks.map((item) => (
              <div key={item.title} className="professional-card rounded-lg p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start free, pay when private evidence matters.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            The preview handles public repositories instantly. The paid workflow connects GitHub, opens checkout, records the audit, and stores the final report for the signed-in user.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            ["01", "Paste a public repo", "Get an immediate snapshot for early screening."],
            ["02", "Connect GitHub", "Select a private repo from your authenticated account."],
            ["03", "Run the paid audit", "Stripe Checkout unlocks the deeper report workflow."],
            ["04", "Share or negotiate", "Use findings, cost estimates, and report links in the deal room."],
          ].map(([step, title, body]) => (
            <div key={step} className="professional-card flex gap-4 rounded-lg p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-emerald-200">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Straightforward diligence pricing.</h2>
          </div>
          <p className="max-w-md text-left text-sm leading-6 text-zinc-400 sm:text-right">
            Use the preview for quick screening. Use paid reports when money, trust, or closing conditions are on the line.
          </p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-lg border p-6 ${
                plan.featured
                  ? "border-emerald-300/40 bg-emerald-300/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.featured && (
                <div className="mb-4 inline-flex rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                  Seller favorite
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 text-4xl font-semibold text-white">{plan.price}</div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{plan.body}</p>
              <ul className="mt-6 space-y-3 pb-8">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-auto inline-flex w-full min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-emerald-400 text-black hover:bg-emerald-300"
                    : "border border-white/15 text-white hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <Link href="/sample-report" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-emerald-100">
            View and download a full sample report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="blog" className="border-y border-white/10 bg-white/[0.02] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Diligence notes</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Practical guidance for small software deals.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-400">
              Make technical risk understandable before it becomes a post-close surprise.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="professional-card rounded-lg p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-500">{post.readTime}</span>
                </div>
                <BookOpen className="mb-4 h-5 w-5 text-emerald-300" />
                <h3 className="text-lg font-semibold leading-7 text-white">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{post.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Clear answers before the audit starts.</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            DueDev is built for practical deal work: fast screening, private evidence, and reports that make risk easier to price.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.question} className="professional-card group rounded-lg p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-white">
                {item.question}
                <span className="text-emerald-300 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 text-center">
        <div className="rounded-lg border border-orange-300/25 bg-orange-300/10 p-8">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-orange-200" />
          <h2 className="text-3xl font-semibold tracking-tight text-white">Do not buy blind.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
            A small repo can hide expensive auth, billing, dependency, and deployment problems. Find them before the LOI gets expensive.
          </p>
          <Link
            href="#free-audit"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Start with a preview
            <Search className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 text-sm text-zinc-500 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <LogoLockup markClassName="h-8 w-8" textClassName="font-semibold text-zinc-200" />
            <p className="mt-4 max-w-sm leading-6">
              Technical due diligence for small SaaS acquisitions. Preview public repos, audit private repos, and share seller-ready proof.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" />
              Source code is analyzed only for report generation.
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white">Product</h3>
            <div className="mt-3 grid gap-2">
              <Link href="#free-audit" className="transition hover:text-white">Free preview</Link>
              <Link href="/sample-report" className="transition hover:text-white">Sample report</Link>
              <Link href="/dashboard" className="transition hover:text-white">Private audit</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white">Trust</h3>
            <div className="mt-3 grid gap-2">
              <Link href="/security" className="transition hover:text-white">Security</Link>
              <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="transition hover:text-white">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white">Company</h3>
            <div className="mt-3 grid gap-2">
              <Link href="/refund" className="transition hover:text-white">Refund Policy</Link>
              <a href="mailto:hello@duedev.app" className="transition hover:text-white">Contact</a>
              <p>© 2026 DueDev</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
