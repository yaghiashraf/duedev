import { NextResponse } from "next/server";
import { getAuthConfigurationStatus } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = getAuthConfigurationStatus();
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
  const aiProvider =
    configuredProvider === "groq" || configuredProvider === "anthropic"
      ? configuredProvider
      : process.env.GROQ_API_KEY
        ? "groq"
        : "anthropic";
  const aiMissing =
    aiProvider === "groq"
      ? !process.env.GROQ_API_KEY
      : !process.env.ANTHROPIC_API_KEY;

  return NextResponse.json({
    privateAudits: auth,
    stripe: {
      ready: Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_APP_URL),
      missing: [
        ["STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY],
        ["NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL],
      ]
        .filter(([, value]) => !value)
        .map(([name]) => name),
    },
    ai: {
      provider: aiProvider,
      ready: !aiMissing,
      missing: aiMissing ? [aiProvider === "groq" ? "GROQ_API_KEY" : "ANTHROPIC_API_KEY"] : [],
    },
  });
}
