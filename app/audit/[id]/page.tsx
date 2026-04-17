"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp, Share2, ArrowLeft, Loader2,
  TrendingDown, DollarSign, Zap, Lock, Copy
} from "lucide-react";

interface Finding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  file?: string;
  recommendation: string;
}

interface ReportData {
  riskScore: number;
  summary: string;
  securityScore: number;
  codeQualityScore: number;
  scalabilityScore: number;
  dependencyScore: number;
  techDebtHours: number;
  techDebtCost: number;
  acquisitionRisk: string;
  recommendedPriceAdjustment: string;
  findings: Finding[];
  strengths: string[];
  redFlags: string[];
  hiddenCosts: string[];
}

interface Audit {
  id: string;
  repoOwner: string;
  repoName: string;
  repoUrl: string;
  auditType: "SELLER" | "BUYER" | "MONITOR";
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  riskScore: number | null;
  reportData: ReportData | null;
  shareToken: string | null;
  completedAt: string | null;
  createdAt: string;
}

const SEVERITY_CONFIG = {
  critical: { label: "Critical", cls: "text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-500" },
  high: { label: "High", cls: "text-orange-400 bg-orange-500/10 border-orange-500/20", dot: "bg-orange-500" },
  medium: { label: "Medium", cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", dot: "bg-yellow-500" },
  low: { label: "Low", cls: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-500" },
  info: { label: "Info", cls: "text-gray-400 bg-gray-500/10 border-gray-500/20", dot: "bg-gray-500" },
};

function ScoreRing({ score, label, invert = false }: { score: number; label: string; invert?: boolean }) {
  const display = invert ? score : 100 - score;
  const color =
    display >= 80 ? "#22c55e" :
    display >= 60 ? "#eab308" :
    display >= 40 ? "#f97316" : "#ef4444";
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = (display / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={`${pct} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {display}
        </span>
      </div>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[finding.severity];

  return (
    <div className={`border rounded-xl overflow-hidden ${cfg.cls} border-opacity-30`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
          <div className="min-w-0">
            <span className="text-white text-sm font-medium">{finding.title}</span>
            {finding.file && (
              <span className="ml-2 text-xs text-gray-500 font-mono">{finding.file}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.cls}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-500">{finding.category}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-3">
          <p className="text-sm text-gray-300 leading-relaxed">{finding.description}</p>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Recommendation</p>
            <p className="text-sm text-gray-200 leading-relaxed">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const color =
    score >= 75 ? "#ef4444" :
    score >= 50 ? "#f97316" :
    score >= 25 ? "#eab308" : "#22c55e";
  const label =
    score >= 75 ? "Critical" :
    score >= 50 ? "High" :
    score >= 25 ? "Medium" : "Low";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="160" height="90" viewBox="0 0 160 90">
          {/* Track */}
          <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round" />
          {/* Fill */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 204} 204`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-sm font-medium mt-0.5" style={{ color }}>{label} Risk</span>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const auditId = params.id as string;

  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "findings" | "recommendation">("overview");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  const fetchAudit = useCallback(async () => {
    try {
      const res = await fetch(`/api/audit/${auditId}`);
      const { audit } = await res.json();
      setAudit(audit);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [auditId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const timeout = window.setTimeout(() => {
      void fetchAudit();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [status, fetchAudit]);

  // Poll while running
  useEffect(() => {
    if (!audit || audit.status === "COMPLETE" || audit.status === "FAILED") return;
    const interval = setInterval(fetchAudit, 4000);
    return () => clearInterval(interval);
  }, [audit, fetchAudit]);

  const copyShareLink = () => {
    if (!audit?.shareToken) return;
    navigator.clipboard.writeText(`${window.location.origin}/share/${audit.shareToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-white text-xl font-semibold mb-2">Audit not found</h1>
          <Link href="/dashboard" className="text-indigo-400 text-sm">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const report = audit.reportData as ReportData | null;
  const criticalCount = report?.findings?.filter((f) => f.severity === "critical").length ?? 0;
  const highCount = report?.findings?.filter((f) => f.severity === "high").length ?? 0;

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 sticky top-0 z-10 bg-[#09090f]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-semibold text-white">DueDev</span>
            </div>
          </div>
          {audit.status === "COMPLETE" && audit.shareToken && (
            <button
              onClick={copyShareLink}
              className="flex items-center gap-2 text-sm border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all"
            >
              {copied ? <><CheckCircle className="w-4 h-4 text-green-400" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share Report</>}
            </button>
          )}
        </div>
      </nav>

      {/* Running / Pending state */}
      {(audit.status === "RUNNING" || audit.status === "PENDING") && (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="card-border rounded-2xl p-12">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Analyzing codebase...</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              Our AI is scanning <strong className="text-white">{audit.repoOwner}/{audit.repoName}</strong> for
              security vulnerabilities, technical debt, dependencies, and acquisition risks.
              This usually takes 1–3 minutes.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {["Fetching files", "Security scan", "AI analysis"].map((step, i) => (
                <div key={step} className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    i === 0 ? "bg-green-500/20" : i === 1 ? "bg-indigo-500/10 animate-pulse" : "bg-white/5"
                  }`}>
                    {i === 0 ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                     i === 1 ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> :
                     <Clock className="w-4 h-4 text-gray-600" />}
                  </div>
                  <p className="text-xs text-gray-500">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {audit.status === "FAILED" && (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="card-border rounded-2xl p-12">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-3">Audit failed</h1>
            <p className="text-gray-400 text-sm">
              We couldn&apos;t complete the audit. This can happen if the repo is empty, inaccessible, or too large.
            </p>
            <Link href="/dashboard" className="inline-block mt-6 text-indigo-400 text-sm hover:text-indigo-300">
              ← Try another repo
            </Link>
          </div>
        </div>
      )}

      {/* Complete report */}
      {audit.status === "COMPLETE" && report && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                audit.auditType === "BUYER" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                "bg-green-500/10 text-green-400 border border-green-500/20"
              }`}>
                {audit.auditType === "SELLER" ? "Seller Report" :
                 audit.auditType === "BUYER" ? "Buyer Due Diligence" : "Monitor Report"}
              </span>
              {criticalCount > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {criticalCount} Critical
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{audit.repoOwner}/{audit.repoName}</h1>
            <p className="text-gray-400 text-sm">
              Completed {audit.completedAt ? new Date(audit.completedAt).toLocaleString() : ""}
            </p>
          </div>

          {/* Score row */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mb-8">
            <div className="card-border rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm mb-4">Acquisition Risk Score</p>
              <RiskGauge score={report.riskScore} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-border rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <ScoreRing score={report.securityScore} label="Security" />
              </div>
              <div className="card-border rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <ScoreRing score={report.codeQualityScore} label="Code Quality" />
              </div>
              <div className="card-border rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <ScoreRing score={report.scalabilityScore} label="Scalability" />
              </div>
              <div className="card-border rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <ScoreRing score={report.dependencyScore} label="Dependencies" />
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card-border rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Tech Debt</p>
                <p className="text-white text-xl font-bold">{report.techDebtHours} hrs</p>
                <p className="text-gray-500 text-xs">${report.techDebtCost?.toLocaleString()} to fix</p>
              </div>
            </div>
            <div className="card-border rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Critical Findings</p>
                <p className="text-white text-xl font-bold">{criticalCount} critical</p>
                <p className="text-gray-500 text-xs">{highCount} high severity</p>
              </div>
            </div>
            <div className="card-border rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Acquisition Risk</p>
                <p className="text-white text-sm font-semibold leading-snug">{report.acquisitionRisk}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card-border rounded-xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-3">Executive Summary</h2>
            <p className="text-gray-300 leading-relaxed">{report.summary}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl w-fit">
            {(["overview", "findings", "recommendation"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
                {tab === "findings" && report.findings?.length > 0 && (
                  <span className="ml-1.5 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                    {report.findings.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              {report.strengths?.length > 0 && (
                <div className="card-border rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Red Flags */}
              {report.redFlags?.length > 0 && (
                <div className="card-border rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" /> Red Flags
                  </h3>
                  <ul className="space-y-2">
                    {report.redFlags.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Hidden Costs */}
              {report.hiddenCosts?.length > 0 && (
                <div className="card-border rounded-xl p-6 md:col-span-2">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" /> Hidden Costs
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {report.hiddenCosts.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                        <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "findings" && (
            <div className="space-y-3">
              {report.findings?.map((finding, i) => (
                <FindingCard key={i} finding={finding} />
              ))}
              {(!report.findings || report.findings.length === 0) && (
                <div className="card-border rounded-xl p-8 text-center">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-medium">No significant findings</p>
                  <p className="text-gray-400 text-sm mt-1">This codebase is in good shape.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "recommendation" && (
            <div className="space-y-4">
              <div className="card-border rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-400" />
                  Price Adjustment Recommendation
                </h3>
                <p className="text-gray-200 text-lg leading-relaxed">{report.recommendedPriceAdjustment}</p>
              </div>
              <div className="card-border rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  Acquisition Risk Assessment
                </h3>
                <p className="text-gray-200 text-lg leading-relaxed">{report.acquisitionRisk}</p>
              </div>
              {audit.auditType === "BUYER" && (
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-3">Negotiation Summary</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-mono shrink-0">→</span>
                      Tech debt to fix: <strong className="text-white ml-1">{report.techDebtHours} hrs (${report.techDebtCost?.toLocaleString()})</strong>
                    </li>
                    <li className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-mono shrink-0">→</span>
                      Critical vulnerabilities: <strong className="text-white ml-1">{criticalCount} found</strong>
                    </li>
                    <li className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-mono shrink-0">→</span>
                      Overall risk: <strong className="text-white ml-1">{report.riskScore}/100</strong>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Share CTA */}
          {audit.auditType === "SELLER" && audit.shareToken && (
            <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-xl p-6 flex items-center justify-between gap-6">
              <div>
                <h3 className="text-white font-semibold mb-1">Share this report</h3>
                <p className="text-gray-400 text-sm">Attach to your Acquire.com listing to instantly build buyer trust.</p>
              </div>
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-5 py-2.5 rounded-xl transition-all text-sm font-medium shrink-0"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
