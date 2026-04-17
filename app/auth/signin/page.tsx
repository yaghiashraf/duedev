"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Download, GitBranch, Loader2, Lock } from "lucide-react";
import { LogoLockup } from "@/app/brand";

export default function SignInPage() {
  const [githubReady, setGithubReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProviders()
      .then((providers) => setGithubReady(Boolean(providers?.github)))
      .catch(() => setGithubReady(false))
      .finally(() => setLoading(false));
  }, []);

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
                  <p className="font-semibold text-white">Private audits are not accepting checkout yet.</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    The public preview and sample report are available now. Private repository checkout will open once secure GitHub authorization and billing are enabled.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#free-audit"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Run public preview
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sample-report"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Sample report
                  <Download className="h-4 w-4" />
                </Link>
              </div>
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
