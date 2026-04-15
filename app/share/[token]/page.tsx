import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Shield, CheckCircle, AlertTriangle, Clock, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";

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
  findings: Finding[];
  strengths: string[];
  redFlags: string[];
}

const SEVERITY_CONFIG = {
  critical: { label: "Critical", cls: "text-red-400", dot: "bg-red-500" },
  high: { label: "High", cls: "text-orange-400", dot: "bg-orange-500" },
  medium: { label: "Medium", cls: "text-yellow-400", dot: "bg-yellow-500" },
  low: { label: "Low", cls: "text-blue-400", dot: "bg-blue-500" },
  info: { label: "Info", cls: "text-gray-400", dot: "bg-gray-500" },
};

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? "bg-green-500" :
    score >= 60 ? "bg-yellow-500" :
    score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-medium text-white">{score}/100</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const audit = await prisma.audit.findUnique({
    where: { shareToken: token },
    include: { user: { select: { name: true } } },
  });

  if (!audit || audit.status !== "COMPLETE" || audit.auditType !== "SELLER") {
    notFound();
  }

  const report = audit.reportData as unknown as ReportData;
  const criticalCount = report?.findings?.filter((f) => f.severity === "critical").length ?? 0;
  const highCount = report?.findings?.filter((f) => f.severity === "high").length ?? 0;
  const riskColor =
    report.riskScore >= 75 ? "text-red-400" :
    report.riskScore >= 50 ? "text-orange-400" :
    report.riskScore >= 25 ? "text-yellow-400" : "text-green-400";
  const riskLabel =
    report.riskScore >= 75 ? "Critical" :
    report.riskScore >= 50 ? "High" :
    report.riskScore >= 25 ? "Medium" : "Low";

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-white">DueDev</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Seller Report
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            {audit.repoOwner}/{audit.repoName}
          </h1>
          <p className="text-gray-400 text-sm">
            Technical audit verified by DueDev · {audit.completedAt ? new Date(audit.completedAt).toLocaleDateString() : ""}
          </p>
        </div>

        {/* Risk score */}
        <div className="card-border rounded-2xl p-8 text-center mb-8">
          <p className="text-gray-400 text-sm mb-2">Overall Risk Score</p>
          <div className={`text-7xl font-bold mb-2 ${riskColor}`}>{report.riskScore}</div>
          <div className={`text-xl font-semibold ${riskColor}`}>{riskLabel} Risk</div>
          <p className="text-gray-400 text-sm mt-4 max-w-md mx-auto leading-relaxed">{report.summary}</p>
        </div>

        {/* Scores */}
        <div className="card-border rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-5">Quality Scores</h2>
          <div className="space-y-4">
            <ScoreBar score={report.securityScore} label="Security" />
            <ScoreBar score={report.codeQualityScore} label="Code Quality" />
            <ScoreBar score={report.scalabilityScore} label="Scalability" />
            <ScoreBar score={report.dependencyScore} label="Dependencies" />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-border rounded-xl p-5 text-center">
            <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{report.techDebtHours}h</p>
            <p className="text-gray-400 text-xs mt-1">Technical Debt</p>
          </div>
          <div className="card-border rounded-xl p-5 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{criticalCount}</p>
            <p className="text-gray-400 text-xs mt-1">Critical Issues</p>
          </div>
          <div className="card-border rounded-xl p-5 text-center">
            <TrendingDown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{highCount}</p>
            <p className="text-gray-400 text-xs mt-1">High Issues</p>
          </div>
        </div>

        {/* Strengths */}
        {report.strengths?.length > 0 && (
          <div className="card-border rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> Strengths
            </h2>
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

        {/* Findings summary */}
        {report.findings?.length > 0 && (
          <div className="card-border rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-4">Finding Summary</h2>
            <div className="space-y-2">
              {report.findings.slice(0, 5).map((f, i) => {
                const cfg = SEVERITY_CONFIG[f.severity];
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                    <span className="text-sm text-gray-300 flex-1">{f.title}</span>
                    <span className={`text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                );
              })}
              {report.findings.length > 5 && (
                <p className="text-xs text-gray-500 pt-2">
                  + {report.findings.length - 5} more findings in full report
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA for buyers */}
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-8 text-center">
          <DollarSign className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Are you the buyer?</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Get the full Buyer Due Diligence report with price adjustment recommendation,
            hidden cost projections, and negotiation summary — $79.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm"
          >
            Run Buyer Audit · $79
          </Link>
        </div>
      </div>
    </div>
  );
}
