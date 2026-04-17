import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LogoLockup } from "@/app/brand";
import { getRuntimeConfigStatus } from "@/lib/runtime-config";
import type { CheckoutAuditType } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const planCopy: Record<CheckoutAuditType, {
  label: string;
  price: string;
  eyebrow: string;
  description: string;
  bullets: string[];
}> = {
  SELLER: {
    label: "Seller Report",
    price: "$49",
    eyebrow: "Shareable code-quality proof",
    description: "A seller-ready technical diligence report built to reduce buyer objections before calls, listings, and closing requests.",
    bullets: ["Private repository scan", "Security and quality findings", "Shareable report link", "Buyer-facing remediation summary"],
  },
  BUYER: {
    label: "Buyer Due Diligence",
    price: "$79",
    eyebrow: "Acquisition risk before the LOI",
    description: "A practical buyer report that turns source-code evidence into risk, hidden cost, and negotiation guidance.",
    bullets: ["Private repository scan", "Risk score and severity map", "Hidden cost projection", "Price-adjustment language"],
  },
  MONITOR: {
    label: "Continuous Monitor",
    price: "$29/mo",
    eyebrow: "Recurring codebase health checks",
    description: "Ongoing monitoring for security drift, dependency risk, and handoff readiness after the first report.",
    bullets: ["Recurring scans", "Dependency and security drift", "Stored report history", "Operator-ready summaries"],
  },
};

function getPlan(value: string | string[] | undefined): CheckoutAuditType {
  const plan = Array.isArray(value) ? value[0] : value;
  if (plan === "SELLER" || plan === "MONITOR") return plan;
  return "BUYER";
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[]; repoUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const status = getRuntimeConfigStatus();
  const paidAuditsReady = status.paidAudits.ready;
  const plan = getPlan(params.plan);
  const selectedPlan = planCopy[plan];
  const repoUrl = Array.isArray(params.repoUrl) ? params.repoUrl[0] : params.repoUrl;

  return (
      <main className="min-h-screen bg-[#080a09] text-white">
        <nav className="border-b border-white/10 px-4 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <LogoLockup animated markClassName="h-9 w-9" />
            <Link href="/" className="text-sm font-semibold text-zinc-400 transition hover:text-white">
              Back to preview
            </Link>
          </div>
        </nav>

        <section className="relative overflow-hidden px-4 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_12%,rgba(110,231,183,0.14),transparent_34%),radial-gradient(circle_at_75%_16%,rgba(103,232,249,0.1),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-start">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                Secure checkout
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Finish the full DueDev audit.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
                Confirm the report type, connect the repository owner, and complete payment through Stripe. The report is generated after checkout is confirmed.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["1", "Confirm repository", repoUrl ?? "Choose a repo after GitHub sign-in"],
                  ["2", "Authorize GitHub", "Read-only source access for the selected audit"],
                  ["3", "Pay securely", "Stripe Checkout handles card collection"],
                ].map(([step, title, body]) => (
                  <div key={step} className="professional-card rounded-lg p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-emerald-200">
                      {step}
                    </div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card-border rounded-lg p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">{selectedPlan.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{selectedPlan.label}</h2>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                  <p className="text-2xl font-semibold text-white">{selectedPlan.price}</p>
                  <p className="text-xs text-zinc-500">{plan === "MONITOR" ? "monthly" : "one-time"}</p>
                </div>
              </div>

              <p className="text-sm leading-6 text-zinc-400">{selectedPlan.description}</p>

              <div className="mt-5 space-y-3">
                {selectedPlan.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>

              {repoUrl && (
                <div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Preview repository</p>
                  <p className="mt-1 break-words text-sm text-zinc-200">{repoUrl}</p>
                </div>
              )}

              {paidAuditsReady ? (
                <Link
                  href={`/dashboard?plan=${plan}${repoUrl ? `&repoUrl=${encodeURIComponent(repoUrl)}` : ""}`}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  Continue to GitHub and checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="mt-6 rounded-lg border border-orange-300/25 bg-orange-300/10 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-100" />
                    <div>
                      <p className="font-semibold text-white">Checkout is being configured.</p>
                      <p className="mt-1 text-sm leading-6 text-orange-50">
                        The full audit checkout will open after secure GitHub authorization, billing, database, and AI analysis are enabled in production.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/sample-report"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    View sample report
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
              )}

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-zinc-500">
                <Lock className="h-3.5 w-3.5" />
                Card details are handled by Stripe. Repository access is limited to the selected audit.
              </div>
            </aside>
          </div>
        </section>
      </main>
  );
}
