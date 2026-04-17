"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Download,
  FileSearch,
  GitBranch,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import type { DemoAuditReport } from "@/lib/demo-audit";

interface ConfigStatus {
  paidAudits?: {
    ready: boolean;
  };
}

const severityStyles = {
  critical: "border-red-500/25 bg-red-500/10 text-red-200",
  high: "border-orange-500/25 bg-orange-500/10 text-orange-200",
  medium: "border-yellow-500/25 bg-yellow-500/10 text-yellow-100",
  low: "border-cyan-500/25 bg-cyan-500/10 text-cyan-100",
  info: "border-white/10 bg-white/5 text-zinc-300",
};

function scoreColor(score: number) {
  if (score >= 75) return "text-red-300";
  if (score >= 50) return "text-orange-300";
  if (score >= 25) return "text-yellow-200";
  return "text-emerald-300";
}

function qualityColor(score: number) {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-yellow-300";
  if (score >= 40) return "bg-orange-300";
  return "bg-red-400";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="font-semibold text-white">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-white/10">
        <div className={`h-full rounded-md ${qualityColor(score)}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function PublicAuditForm() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/yaghiashraf/duedev");
  const [report, setReport] = useState<DemoAuditReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paidAuditsReady, setPaidAuditsReady] = useState(false);

  const topFindings = useMemo(() => report?.findings.slice(0, 4) ?? [], [report]);

  useEffect(() => {
    fetch("/api/config/status")
      .then((response) => response.json())
      .then((status: ConfigStatus) => setPaidAuditsReady(Boolean(status.paidAudits?.ready)))
      .catch(() => setPaidAuditsReady(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/demo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Preview audit failed.");
      }

      setReport(payload.report);
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "Preview audit failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="free-audit" className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="card-border rounded-lg p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
            <FileSearch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-white">Run a free public repo preview</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Paste a GitHub URL and get a real static risk snapshot before the full private audit.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="repo-url" className="text-sm font-medium text-zinc-200">
            GitHub repository
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="repo-url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/acme/app"
              className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition focus:border-emerald-300/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
              Preview risk
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <ShieldCheck className="mb-2 h-4 w-4 text-emerald-300" />
            Security patterns
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <Clock className="mb-2 h-4 w-4 text-yellow-200" />
            Debt estimate
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <AlertTriangle className="mb-2 h-4 w-4 text-orange-300" />
            Buyer red flags
          </div>
        </div>
        <Link href="/sample-report" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-emerald-100">
          View sample full report
          <Download className="h-4 w-4" />
        </Link>
      </div>

      <div className="card-border min-h-[360px] rounded-lg p-5 sm:p-6">
        {!report && !loading && (
          <div className="flex h-full min-h-[300px] flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Preview report</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">Know the first diligence questions before the call.</h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              The preview checks public source files for exposed credentials, missing runtime pins, weak test signals, dependency hygiene, and handoff risk.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-emerald-300" />
            <p className="font-medium text-white">Scanning public repository files</p>
            <p className="mt-2 text-sm text-zinc-500">This usually finishes in a few seconds.</p>
          </div>
        )}

        {report && (
          <div>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-zinc-500">{report.repo.owner}/{report.repo.name}</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Preview risk report</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{report.summary}</p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <div className={`text-6xl font-bold leading-none ${scoreColor(report.riskScore)}`}>
                  {report.riskScore}
                </div>
                <p className="mt-1 text-sm text-zinc-500">Risk score</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ScoreBar label="Security" score={report.securityScore} />
              <ScoreBar label="Code quality" score={report.codeQualityScore} />
              <ScoreBar label="Scalability" score={report.scalabilityScore} />
              <ScoreBar label="Dependencies" score={report.dependencyScore} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <p className="text-xs text-zinc-500">Files sampled</p>
                <p className="mt-1 text-xl font-semibold text-white">{report.filesAnalyzed}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <p className="text-xs text-zinc-500">Debt estimate</p>
                <p className="mt-1 text-xl font-semibold text-white">{report.techDebtHours} hrs</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                <p className="text-xs text-zinc-500">Cost proxy</p>
                <p className="mt-1 text-xl font-semibold text-white">${report.techDebtCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {topFindings.map((finding) => (
                <div key={`${finding.title}-${finding.file}`} className={`rounded-lg border p-3 ${severityStyles[finding.severity]}`}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-white">{finding.title}</p>
                    <span className="text-xs uppercase tracking-[0.14em]">{finding.severity}</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-zinc-300">{finding.description}</p>
                </div>
              ))}

              {topFindings.length === 0 && (
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  No preview-level blockers found in sampled public files.
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">
                  {paidAuditsReady ? "Need private repo coverage?" : "Want to see the full report format?"}
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  {paidAuditsReady
                    ? "Run the full audit with GitHub OAuth, billing flow, and shareable report history."
                    : "Private checkout is not open yet. Review the professional report format before running a paid audit."}
                </p>
              </div>
              <Link
                href={paidAuditsReady ? "/dashboard" : "/sample-report"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                {paidAuditsReady ? "Full audit" : "View sample report"}
                {paidAuditsReady ? <ArrowRight className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
