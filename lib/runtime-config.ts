type ConfigGroup = {
  ready: boolean;
  missing: string[];
};

function missingVars(entries: Array<[string, string | undefined]>): string[] {
  return entries.filter(([, value]) => !value).map(([name]) => name);
}

export function getPrivateAuditConfigurationStatus(): ConfigGroup {
  const missing = missingVars([
    ["GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID],
    ["GITHUB_CLIENT_SECRET", process.env.GITHUB_CLIENT_SECRET],
    ["NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET],
    ["DATABASE_URL", process.env.DATABASE_URL],
  ]);

  return {
    ready: missing.length === 0,
    missing,
  };
}

export function getStripeConfigurationStatus(): ConfigGroup {
  const missing = missingVars([
    ["STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY],
    ["NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL],
  ]);

  return {
    ready: missing.length === 0,
    missing,
  };
}

export function getAiConfigurationStatus(): ConfigGroup & { provider: "anthropic" | "groq" } {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
  const provider =
    configuredProvider === "groq" || configuredProvider === "anthropic"
      ? configuredProvider
      : process.env.GROQ_API_KEY
        ? "groq"
        : "anthropic";

  const missing = provider === "groq" && !process.env.GROQ_API_KEY
    ? ["GROQ_API_KEY"]
    : provider === "anthropic" && !process.env.ANTHROPIC_API_KEY
      ? ["ANTHROPIC_API_KEY"]
      : [];

  return {
    provider,
    ready: missing.length === 0,
    missing,
  };
}

export function getRuntimeConfigStatus() {
  const privateAudits = getPrivateAuditConfigurationStatus();
  const stripe = getStripeConfigurationStatus();
  const ai = getAiConfigurationStatus();

  return {
    privateAudits,
    stripe,
    ai,
    paidAudits: {
      ready: privateAudits.ready && stripe.ready && ai.ready,
      missing: [...privateAudits.missing, ...stripe.missing, ...ai.missing],
    },
  };
}
