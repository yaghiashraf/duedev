# DueDev

Technical due diligence for micro-SaaS acquisitions.

DueDev now has two useful paths:

- Public preview audit: anyone can paste a public GitHub repo and get a deterministic risk snapshot without signing in.
- Full private audit: signed-in users connect GitHub, pick a repo, pay through Stripe, and receive a stored report.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- NextAuth with GitHub OAuth
- Prisma 7 with Postgres
- Stripe Checkout and webhooks
- Groq or Anthropic API for full private report generation

## Requirements

Node.js `20.19.0` or newer is required by Next.js 16 and Prisma 7.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The public preview works without secrets because it only reads public GitHub repository files through the public GitHub API.

## Environment

Full private audits require these groups of variables:

- App: `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Database: `DATABASE_URL`
- GitHub OAuth: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Public preview rate limit: optional `GITHUB_TOKEN`
- AI: `AI_PROVIDER`, plus `GROQ_API_KEY`/`GROQ_MODEL` for Groq or `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL` for Anthropic. If `AI_PROVIDER` is omitted, the app uses Groq when `GROQ_API_KEY` exists and otherwise falls back to Anthropic.
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`; `STRIPE_*_PRICE_ID` values are optional because checkout can fall back to inline Stripe price data. Test-mode prices have been created in Stripe: Seller `price_1TNEPCA3gGBV3QMFk28pWtjj`, Buyer `price_1TNEPCA3gGBV3QMFVKNSN4pK`, Monitor `price_1TNEPHA3gGBV3QMFHhmMgQIw`.

For the hosted Vercel app, the GitHub OAuth callback URL must be:

```text
https://duedev.vercel.app/api/auth/callback/github
```

If GitHub OAuth is not configured, `/api/auth/providers` returns `{}` and the sign-in screen shows the missing setup variables instead of failing with a generic server error.

## Product Flow

1. Users paste a public repo into the preview audit on the homepage.
2. The `/api/demo-audit` route samples public source files and returns a risk report.
3. Users who need private coverage sign in with GitHub.
4. The dashboard lists repos from GitHub OAuth.
5. Checkout creates a pending audit and redirects to Stripe.
6. Stripe webhook marks the audit paid and starts the private audit.
7. The audit page polls until the report is complete.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
