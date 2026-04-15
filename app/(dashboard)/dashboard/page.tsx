"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Shield, GitBranch, LogOut, Search, Clock, CheckCircle,
  AlertTriangle, XCircle, ChevronRight, Plus, Loader2,
} from "lucide-react";
import Link from "next/link";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  description: string | null;
  language: string | null;
  updated_at: string | null;
}

interface Audit {
  id: string;
  repoOwner: string;
  repoName: string;
  auditType: "SELLER" | "BUYER" | "MONITOR";
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  riskScore: number | null;
  shareToken: string | null;
  paidAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

const AUDIT_TYPES = [
  {
    id: "SELLER",
    label: "Seller Report",
    price: "$49",
    desc: "Prove your codebase is clean. Attach to your listing.",
    color: "border-green-500/30 bg-green-500/5",
    badge: "bg-green-500/10 text-green-400",
  },
  {
    id: "BUYER",
    label: "Buyer Due Diligence",
    price: "$79",
    desc: "Risk score + price adjustment before acquisition.",
    color: "border-indigo-500/30 bg-indigo-500/5",
    badge: "bg-indigo-500/10 text-indigo-400",
  },
  {
    id: "MONITOR",
    label: "Continuous Monitor",
    price: "$29/mo",
    desc: "Weekly security scans and dependency alerts.",
    color: "border-orange-500/30 bg-orange-500/5",
    badge: "bg-orange-500/10 text-orange-400",
  },
];

function RiskBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const level =
    score >= 75 ? { label: "Critical", cls: "text-red-400 bg-red-500/10" } :
    score >= 50 ? { label: "High", cls: "text-orange-400 bg-orange-500/10" } :
    score >= 25 ? { label: "Medium", cls: "text-yellow-400 bg-yellow-500/10" } :
    { label: "Low", cls: "text-green-400 bg-green-500/10" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${level.cls}`}>
      {level.label} Risk · {score}/100
    </span>
  );
}

function StatusIcon({ status }: { status: Audit["status"] }) {
  if (status === "COMPLETE") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "FAILED") return <XCircle className="w-4 h-4 text-red-400" />;
  if (status === "RUNNING") return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
  return <Clock className="w-4 h-4 text-gray-500" />;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [repos, setRepos] = useState<Repo[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedAuditType, setSelectedAuditType] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [step, setStep] = useState<"repos" | "type">("repos");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/repos")
      .then((r) => r.json())
      .then((d) => { setRepos(d.repos ?? []); setLoadingRepos(false); })
      .catch(() => setLoadingRepos(false));

    fetch("/api/audits")
      .then((r) => r.json())
      .then((d) => setAudits(d.audits ?? []));
  }, [status]);

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const handleSelectRepo = (repo: Repo) => {
    setSelectedRepo(repo);
    setStep("type");
  };

  const handleLaunch = async () => {
    if (!selectedRepo || !selectedAuditType) return;
    setLaunching(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoOwner: selectedRepo.owner,
          repoName: selectedRepo.name,
          auditType: selectedAuditType,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLaunching(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-white">DueDev</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-400">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: New Audit */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">New Audit</h1>

          {step === "repos" && (
            <div className="card-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <GitBranch className="w-5 h-5 text-gray-400" />
                <h2 className="text-white font-medium">Select a repository</h2>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search repos..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              {loadingRepos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {filteredRepos.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-medium truncate">{repo.name}</span>
                          {repo.private && (
                            <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded shrink-0">private</span>
                          )}
                          {repo.language && (
                            <span className="text-xs text-gray-500 shrink-0">{repo.language}</span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-gray-500 truncate">{repo.description}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                  {filteredRepos.length === 0 && (
                    <p className="text-center text-gray-500 py-8 text-sm">No repos found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === "type" && selectedRepo && (
            <div className="card-border rounded-2xl p-6">
              <button
                onClick={() => { setStep("repos"); setSelectedAuditType(null); }}
                className="text-sm text-indigo-400 hover:text-indigo-300 mb-5 flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl">
                <GitBranch className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">{selectedRepo.full_name}</p>
                  <p className="text-gray-500 text-xs">{selectedRepo.language ?? "Unknown language"}</p>
                </div>
              </div>

              <h2 className="text-white font-medium mb-4">Choose audit type</h2>
              <div className="space-y-3 mb-6">
                {AUDIT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAuditType(type.id)}
                    className={`w-full flex items-start justify-between p-4 rounded-xl border transition-all text-left ${
                      selectedAuditType === type.id
                        ? type.color + " border-opacity-60"
                        : "border-white/5 hover:border-white/10 bg-white/2"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{type.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.badge}`}>
                          {type.price}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">{type.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 transition-all ${
                      selectedAuditType === type.id
                        ? "border-indigo-400 bg-indigo-400"
                        : "border-gray-600"
                    }`} />
                  </button>
                ))}
              </div>

              <button
                onClick={handleLaunch}
                disabled={!selectedAuditType || launching}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                {launching ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout...</>
                ) : (
                  <><Plus className="w-4 h-4" /> Start Audit</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Past Audits */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Audits</h2>
          <div className="space-y-3">
            {audits.length === 0 && (
              <div className="card-border rounded-2xl p-8 text-center">
                <AlertTriangle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No audits yet.</p>
                <p className="text-gray-600 text-xs mt-1">Select a repo to get started.</p>
              </div>
            )}
            {audits.map((audit) => (
              <Link
                key={audit.id}
                href={audit.status === "COMPLETE" ? `/audit/${audit.id}` : "#"}
                className={`block card-border rounded-xl p-4 transition-all ${
                  audit.status === "COMPLETE" ? "hover:border-indigo-500/30 cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {audit.repoOwner}/{audit.repoName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {audit.auditType === "SELLER" ? "Seller Report" :
                       audit.auditType === "BUYER" ? "Buyer Due Diligence" : "Monitor"}
                      {" · "}
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusIcon status={audit.status} />
                </div>
                {audit.status === "COMPLETE" && (
                  <RiskBadge score={audit.riskScore} />
                )}
                {audit.status === "RUNNING" && (
                  <span className="text-xs text-indigo-400">Analyzing codebase...</span>
                )}
                {audit.status === "PENDING" && !audit.paidAt && (
                  <span className="text-xs text-gray-500">Awaiting payment</span>
                )}
                {audit.status === "FAILED" && (
                  <span className="text-xs text-red-400">Audit failed</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
