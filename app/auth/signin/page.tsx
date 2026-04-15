"use client";

import { signIn } from "next-auth/react";
import { Shield, GitBranch, Lock } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xl font-semibold text-white">DueDev</span>
        </div>

        {/* Card */}
        <div className="card-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Sign in to DueDev
          </h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            Connect GitHub to start auditing repositories
          </p>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <GitBranch className="w-5 h-5" />
            Continue with GitHub
          </button>

          <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
            We request read access to your repositories to perform the audit.
            We never store your source code.
          </p>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Lock className="w-3 h-3" />
            OAuth 2.0 · Read-only repo access
          </div>
        </div>
      </div>
    </div>
  );
}
