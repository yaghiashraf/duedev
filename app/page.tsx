import Link from "next/link";
import { Shield, Search, TrendingDown, CheckCircle, AlertTriangle, ArrowRight, GitBranch, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-white text-lg">DueDev</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it works
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-3 h-3" />
            AI-powered technical due diligence for SaaS acquisitions
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Know what you&apos;re buying{" "}
            <span className="gradient-text">before you buy it.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect a GitHub repo. Get a Risk Score, tech debt estimate, hidden cost
            projection, and acquisition recommendation — in minutes. Built for the
            Acquire.com era.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg"
            >
              Audit a repo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl transition-all text-lg"
            >
              See a sample report
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-white/5 py-6 px-6 mb-20">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> GitHub OAuth — no code stored</span>
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Reports in under 3 minutes</span>
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Shareable report links</span>
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Works on private repos</span>
        </div>
      </div>

      {/* Problem / Who is this for */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-border rounded-2xl p-8 glow">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">For Buyers</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              You&apos;re about to spend $5K–$200K on a SaaS. The founder says the code is clean.
              You have no way to verify that. DueDev gives you a technical risk score and a
              recommended price adjustment based on what we find — before you sign.
            </p>
            <div className="space-y-3">
              {[
                "Acquisition Risk Score (0–100)",
                "Security vulnerabilities found",
                "Tech debt: hours + cost to fix",
                "Hidden cost projection at 10x scale",
                "Price adjustment recommendation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 text-indigo-400 font-semibold text-lg">$79 one-time</div>
          </div>

          <div className="card-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">For Sellers</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Beat the due diligence question before it&apos;s asked. Attach a DueDev Seller Report
              to your listing and instantly build buyer trust. Show them the score, the clean
              bill of health, and close faster.
            </p>
            <div className="space-y-3">
              {[
                "Clean codebase certification",
                "Shareable PDF + public link",
                "Security & dependency scan",
                "Code quality metrics",
                "Scalability assessment",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 text-indigo-400 font-semibold text-lg">$49 one-time</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">How it works</h2>
        <p className="text-gray-400 text-center mb-16">Three steps. Under 5 minutes.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <GitBranch className="w-6 h-6 text-indigo-400" />,
              title: "Connect your repo",
              desc: "Sign in with GitHub. Select any repo you own — public or private. We read but never store your code.",
            },
            {
              step: "02",
              icon: <Zap className="w-6 h-6 text-indigo-400" />,
              title: "Choose your audit",
              desc: "Seller Report ($49) to prove quality. Buyer Report ($79) to assess risk before acquisition.",
            },
            {
              step: "03",
              icon: <Shield className="w-6 h-6 text-indigo-400" />,
              title: "Get your report",
              desc: "AI scans the codebase. You get a risk score, findings, tech debt estimate, and acquisition recommendation.",
            },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="card-border rounded-2xl p-6">
                <div className="text-indigo-500/30 font-bold text-5xl mb-4">{item.step}</div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we check */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">What we check</h2>
        <p className="text-gray-400 text-center mb-16">Every audit covers these dimensions.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🔐", title: "Security", desc: "Exposed secrets, injection vulnerabilities, missing auth, insecure randomness" },
            { icon: "📦", title: "Dependencies", desc: "Outdated packages, CVE vulnerabilities, deprecated libraries, lock file health" },
            { icon: "🏗️", title: "Architecture", desc: "Scalability bottlenecks, monolith risks, missing error handling, tight coupling" },
            { icon: "⚡", title: "Performance", desc: "Unoptimized queries, missing caching, N+1 patterns, memory leaks" },
            { icon: "🧪", title: "Code Quality", desc: "Test coverage, complexity metrics, dead code, maintainability index" },
            { icon: "💸", title: "Hidden Costs", desc: "Server cost projections at scale, vendor lock-in risks, tech debt in dev-hours" },
          ].map((item) => (
            <div key={item.title} className="card-border rounded-xl p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-medium text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-16">Pay per audit, or monitor continuously.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Seller Audit",
              price: "$49",
              period: "one-time",
              desc: "Attach to your Acquire.com listing. Prove your codebase is clean.",
              features: [
                "Security scan",
                "Dependency audit",
                "Code quality score",
                "Scalability assessment",
                "Shareable PDF report",
                "Public link to share",
              ],
              cta: "Get Seller Report",
              highlight: false,
            },
            {
              name: "Buyer Audit",
              price: "$79",
              period: "one-time",
              desc: "Before you commit to a $5K–$200K acquisition, know what you're buying.",
              features: [
                "Everything in Seller +",
                "Acquisition Risk Score",
                "Tech debt in hours + $",
                "Price adjustment recommendation",
                "Hidden cost projection",
                "Red flags highlighted",
              ],
              cta: "Get Buyer Report",
              highlight: true,
            },
            {
              name: "Monitor",
              price: "$29",
              period: "/month",
              desc: "Continuous security monitoring for your live SaaS product.",
              features: [
                "Weekly security scans",
                "New vulnerability alerts",
                "Dependency update alerts",
                "Monthly health digest",
                "Slack/email notifications",
                "Historical score tracking",
              ],
              cta: "Start Monitoring",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.highlight
                  ? "bg-indigo-500/10 border border-indigo-500/30 ring-1 ring-indigo-500/20"
                  : "card-border"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs text-indigo-400 font-semibold mb-4 uppercase tracking-wide">Most Popular</div>
              )}
              <h3 className="font-semibold text-white text-lg mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`block text-center py-3 px-6 rounded-xl font-medium transition-all text-sm ${
                  plan.highlight
                    ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                    : "border border-white/10 hover:border-white/20 text-gray-300 hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
        <div className="card-border rounded-2xl p-12 glow">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Don&apos;t buy blind.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The micro-SaaS acquisition market moves fast. Buyers skip due diligence and
            discover the tech debt after the wire transfer. $79 is the cheapest insurance
            policy you&apos;ll ever buy.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl transition-all"
          >
            Run your first audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-gray-400 text-sm">DueDev</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Lock className="w-3 h-3" />
            We read your repo to generate the report. We never store your source code.
          </div>
          <p className="text-gray-600 text-xs">© 2025 DueDev</p>
        </div>
      </footer>
    </div>
  );
}
