export const sampleReportMarkdown = `# DueDev Buyer Due Diligence Report

Repository: acme/ledger-app
Audit type: Buyer Due Diligence
Report date: April 17, 2026
Prepared by: DueDev

## Executive Summary

DueDev reviewed a representative SaaS codebase before acquisition close. The product appears commercially viable, but the repository carries material handoff risk around environment documentation, automated testing, and dependency operations. Nothing in the sample indicates a catastrophic rewrite, but the buyer should require remediation commitments before final payment.

Overall acquisition risk score: 57 / 100
Risk level: High
Estimated remediation: 18 engineering hours
Cost proxy: $2,700 at $150/hr
Recommended deal posture: proceed with a documented technical holdback or seller remediation window.

## What DueDev Reviewed

- Application structure and framework conventions
- Authentication and authorization signals
- API route protection patterns
- Dependency manifest and lockfile health
- Environment variable handoff readiness
- Build, lint, and test automation
- Database schema and migration visibility
- Operational documentation and deployment repeatability

## Scorecard

| Category | Score | Notes |
| --- | ---: | --- |
| Security | 76 / 100 | No obvious hardcoded production secret in sampled files, but auth coverage needs confirmation. |
| Dependencies | 64 / 100 | Lockfile exists, but dependency update posture is not documented. |
| Code Quality | 58 / 100 | Clear application structure with insufficient test coverage for buyer confidence. |
| Handoff Readiness | 43 / 100 | Missing environment docs create avoidable onboarding risk. |
| Scalability | 69 / 100 | Architecture appears serviceable for current stage, with caching and queueing assumptions unresolved. |

## Key Findings

### High: Missing environment handoff documentation

Business impact: A buyer cannot reliably reproduce production or preview deployments without knowing which environment variables are required, which are optional, and which third-party accounts they belong to.

Evidence reviewed:
- No complete environment example was available in the sampled repository.
- Billing, auth, database, and AI provider configuration were implied by code paths.

Recommendation:
- Add .env.example with safe placeholder values.
- Document variable ownership: GitHub OAuth, Stripe, database, AI provider, app URL, webhook secret.
- Include setup notes for local development and Vercel deployment.

Estimated fix: 2-3 hours

### Medium: Automated test coverage is not acquisition-ready

Business impact: Buyers inherit regression risk in the most valuable flows: sign-in, checkout, audit creation, webhook processing, and report rendering.

Evidence reviewed:
- No clear smoke test path was identified for the purchase-to-report journey.
- UI and API behavior depend on several external systems.

Recommendation:
- Add smoke tests for preview audit, checkout session creation, webhook success handling, and report access control.
- Add CI gates for lint, typecheck, and production build.

Estimated fix: 6-8 hours

### Medium: Stripe configuration should be explicit

Business impact: A working checkout flow depends on Stripe keys, price IDs or inline price fallback, webhook secret, and app URL consistency. Misalignment can create paid audits that never run.

Recommendation:
- Use Stripe-managed Price IDs in production.
- Keep inline price fallback for local development.
- Confirm webhook endpoint in Stripe dashboard points to /api/stripe/webhook.
- Verify checkout success URL includes the audit id and session id.

Estimated fix: 3-4 hours

### Low: Public preview rate limit depends on GitHub API allowance

Business impact: The free preview can fail under heavy anonymous usage if no GitHub token is configured server-side.

Recommendation:
- Set a low-scope GitHub token for the public preview scanner.
- Keep private audit OAuth separate from public preview scanning.

Estimated fix: 1 hour

## Strengths

- The product has a clear buyer/seller split and a meaningful acquisition diligence use case.
- The free public preview provides immediate value before account creation.
- The full audit flow has a practical monetization path through Stripe Checkout.
- Report storage avoids saving raw source code and focuses on findings and metadata.
- The app uses a modern Next.js architecture with typed server routes.

## Hidden Costs

- Expect 1-2 engineering days to add buyer-grade smoke tests and CI confidence.
- Expect 2-4 hours to fully document production environment handoff.
- Expect 1-2 hours to configure live Stripe products, prices, and webhook endpoint.
- Expect additional diligence if the acquired app handles regulated data, payments, health data, or enterprise SSO.

## Buyer Negotiation Notes

Use the findings as close conditions rather than generic objections:

- Require environment documentation before final transfer.
- Require a successful production build under the documented Node version.
- Require Stripe webhook verification in the buyer-controlled Stripe account.
- Hold back $2,500-$5,000 or require seller remediation if tests and deployment docs are not completed before close.

## Recommended Next Steps

1. Ask the seller for production environment documentation.
2. Run a full authenticated DueDev audit against the private repository.
3. Confirm Stripe, database, GitHub OAuth, and AI provider ownership transfer.
4. Require a clean build and smoke test result before asset transfer.
5. Attach the final report to the closing checklist.

## DueDev Position

Proceed with caution. The codebase does not present as a rebuild, but operational gaps increase buyer handoff risk. The buyer should not close without clear environment documentation, a working checkout-to-report test, and proof that billing webhooks function in the target deployment.
`;
