"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, GitBranch, Loader2, Lock } from "lucide-react";
import { LogoLockup } from "@/app/brand";

interface ConfigStatus {
  privateAudits?: {
    ready: boolean;
    missing: string[];
  };
}

export default function SignInPage() {
  const [githubReady, setGithubReady] = useState(false);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProviders().catch(() => null),
      fetch("/api/config/status").then((res) => res.json()).catch(() => null),
    ])
      .then(([providers, config]) => {
        setGithubReady(Boolean(providers?.github));
        setConfigStatus(config);
      })
      .catch(() => setGithubReady(false))
      .finally(() => setLoading(false));
  }, []);

  const missingPrivateAuditConfig = configStatus?.privateAudits?.missing ?? [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080a09] px-4 text-white">
      <div className="w-full max-w-md">
        <LogoLockup
          className="mb-10 flex items-center justify-center gap-2"
          markClassName="h-10 w-10"
          textClassName="text-xl font-semibold text-white"
          animated
        />

        <div className="card-border rounded-lg p-8">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Audit a private repository</h1>
          <p className="mt-2 text-center text-sm leading-6 text-zinc-400">
            Connect GitHub to select private repos, run checkout, and keep report history.
          </p>

          {loading ? (
            <div className="mt-8 flex min-h-12 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
            </div>
          ) : githubReady ? (
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-white px-6 font-semibold text-black transition hover:bg-zinc-200"
            >
              <GitBranch className="h-5 w-5" />
              Continue with GitHub
            </button>
          ) : (
            <div className="mt-8 rounded-lg border border-orange-300/25 bg-orange-300/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-200" />
                <div>
                  <p className="font-semibold text-white">GitHub sign-in is not configured on this deployment.</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    Purchase buttons for private audits stop here until the hosted app has GitHub OAuth, database, and auth secrets in Vercel.
                  </p>
                  {missingPrivateAuditConfig.length > 0 && (
                    <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-100">
                        Missing environment variables
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {missingPrivateAuditConfig.map((name) => (
                          <span key={name} className="rounded-md bg-white/10 px-2 py-1 text-xs text-zinc-200">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/#free-audit"
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Run public preview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-xs text-zinc-500">
            <Lock className="h-3.5 w-3.5" />
            OAuth access is used only to read repositories for selected audits.
          </div>
        </div>
      </div>
    </main>
  );
}
