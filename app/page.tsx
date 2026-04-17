import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  GitBranch,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";
import PublicAuditForm from "./public-audit-form";

const trustPoints = [
  "Public preview works without sign-in",
  "Private audits use GitHub OAuth",
  "Source code is read for analysis, not stored",
  "Seller reports get shareable links",
];

const checks = [
  {
    icon: ShieldCheck,
    title: "Security posture",
    body: "Credential exposure, weak auth patterns, dangerous runtime execution, and route protection gaps.",
  },
  {
    icon: GitBranch,
    title: "Handoff quality",
    body: "Runtime pins, lockfiles, environment docs, CI signals, and repeatable deployment clues.",
  },
  {
    icon: Clock,
    title: "Remediation scope",
    body: "Engineering hours, cost proxy, and the findings most likely to become closing conditions.",
  },
  {
    icon: DollarSign,
    title: "Buyer leverage",
    body: "Risk language that maps technical debt to holdbacks, price adjustments, and post-close work.",
  },
];

const plans = [
  {
    name: "Public Preview",
    price: "$0",
    body: "Static diligence snapshot for public GitHub repositories.",
    items: ["Public repo scan", "Risk score", "Top findings", "Debt estimate"],
    href: "#free-audit",
    cta: "Try preview",
  },
  {
    name: "Seller Report",
    price: "$49",
    body: "A shareable quality report for listings and buyer conversations.",
    items: ["Private repo access", "Security checks", "Code quality score", "Shareable report link"],
    href: "/dashboard",
    cta: "Create seller report",
    featured: true,
  },
  {
    name: "Buyer Audit",
    price: "$79",
    body: "Acquisition diligence before an LOI, wire, or handoff.",
    items: ["Everything in Seller", "Price adjustment note", "Hidden cost projection", "Red flag summary"],
    href: "/dashboard",
    cta: "Start buyer audit",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080a09] text-white">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#080a09]/88 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">DueDev</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#free-audit" className="text-sm text-zinc-400 transition hover:text-white">
              Free preview
            </Link>
            <Link href="#checks" className="text-sm text-zinc-400 transition hover:text-white">
              Checks
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-400 transition hover:text-white">
              Pricing
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            Full audit
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80"
          alt="Engineers reviewing acquisition diligence on laptops"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a09]/80 via-[#080a09]/88 to-[#080a09]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-20 sm:pb-20 sm:pt-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-100">
              <Zap className="h-3.5 w-3.5" />
              Technical due diligence for micro-SaaS deals
            </div>
            <h1 className="max-w-4xl break-words text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find the code risk before the money moves.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Preview any public GitHub repo, then run a private audit for acquisition risk, hidden debt, and seller-ready proof.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#free-audit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 text-base font-semibold text-black transition hover:bg-emerald-300"
              >
                Run free preview
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-black/20 px-6 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Audit private repo
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
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
              Each report turns repo evidence into practical diligence language for buyers, sellers, and operators.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {checks.map((item) => (
              <div key={item.title} className="card-border rounded-lg p-5">
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
            The preview handles public repos instantly. The paid workflow connects GitHub, creates a checkout session, records the audit, and stores the final report for the signed-in user.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            ["01", "Paste a public repo", "Get an immediate snapshot for early screening."],
            ["02", "Connect GitHub", "Select a private repo from your authenticated account."],
            ["03", "Run the paid audit", "Stripe checkout unlocks the deeper report workflow."],
            ["04", "Share or negotiate", "Use the report link, findings, and debt estimate in the deal room."],
          ].map(([step, title, body]) => (
            <div key={step} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
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
          <p className="max-w-md text-sm leading-6 text-zinc-400">
            Use the preview for quick screening. Use paid reports when money, trust, or closing conditions are on the line.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 ${
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
              <ul className="mt-6 space-y-3">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex w-full min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
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

      <footer className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-zinc-300">
            <Shield className="h-4 w-4 text-emerald-300" />
            DueDev
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5" />
            Source code is analyzed only for report generation.
          </div>
          <p>© 2026 DueDev</p>
        </div>
      </footer>
    </main>
  );
}
