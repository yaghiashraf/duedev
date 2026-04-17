import Link from "next/link";
import { ArrowLeft, Download, FileText, ShieldCheck, TrendingDown } from "lucide-react";
import { LogoLockup } from "@/app/brand";

const findings = [
  {
    severity: "High",
    title: "Missing environment handoff documentation",
    body: "A buyer cannot reliably reproduce production without knowing which variables are required and which third-party accounts they belong to.",
  },
  {
    severity: "Medium",
    title: "Automated test coverage is not acquisition-ready",
    body: "The purchase-to-report flow needs smoke coverage before a buyer should treat the system as safely transferable.",
  },
  {
    severity: "Medium",
    title: "Stripe configuration should be explicit",
    body: "Checkout depends on matching API mode, price configuration, webhook secret, and success URL behavior.",
  },
];

export default function SampleReportPage() {
  return (
    <main className="min-h-screen bg-[#080a09] text-white">
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <LogoLockup markClassName="h-8 w-8" />
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-black/30 text-emerald-200">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Sample report</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Buyer Due Diligence Report for acme/ledger-app
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            This sample shows the level of detail a buyer receives: executive summary, scorecard, findings, business impact, remediation estimates, hidden costs, and negotiation notes.
          </p>
          <Link
            href="/api/sample-report"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Download className="h-4 w-4" />
            Download sample report
          </Link>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["57/100", "Risk score", "High leverage issues need deal attention."],
            ["18 hrs", "Remediation estimate", "Scoped work before or after close."],
            ["$2,700", "Cost proxy", "Useful baseline for holdback discussion."],
          ].map(([value, label, body]) => (
            <div key={label} className="professional-card rounded-lg p-5">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-2 font-medium text-emerald-200">{label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h2 className="text-2xl font-semibold text-white">Executive Summary</h2>
          </div>
          <p className="text-sm leading-7 text-zinc-300">
            The product appears commercially viable, but the repository carries material handoff risk around environment documentation, automated testing, and dependency operations. Nothing in the sample indicates a catastrophic rewrite, but the buyer should require remediation commitments before final payment.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-orange-200" />
            <h2 className="text-2xl font-semibold text-white">Key Findings</h2>
          </div>
          <div className="space-y-3">
            {findings.map((finding) => (
              <div key={finding.title} className="professional-card rounded-lg p-5">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-white">{finding.title}</h3>
                  <span className="rounded-lg border border-orange-300/25 bg-orange-300/10 px-2.5 py-1 text-xs font-semibold text-orange-100">
                    {finding.severity}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-400">{finding.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold text-white">Recommended Buyer Position</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Proceed with caution. The codebase does not present as a rebuild, but operational gaps increase buyer handoff risk. The buyer should not close without clear environment documentation, a working checkout-to-report test, and proof that billing webhooks function in the target deployment.
          </p>
        </section>
      </div>
    </main>
  );
}
