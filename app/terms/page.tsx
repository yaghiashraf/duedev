import { LegalPage } from "@/app/legal-content";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="April 17, 2026"
      intro="These terms govern use of DueDev. DueDev provides technical diligence support, not legal, financial, tax, or investment advice."
      sections={[
        {
          heading: "Use of the service",
          body: [
            "You may use DueDev only for repositories you own, administer, or are authorized to assess.",
            "You are responsible for ensuring that repository access, report sharing, and acquisition discussions comply with your agreements and applicable law.",
          ],
        },
        {
          heading: "Reports and recommendations",
          body: [
            "DueDev reports are evidence-based software risk assessments. They may contain estimates, heuristics, AI-generated analysis, and static scanning results.",
            "Reports are not a substitute for professional legal, security, financial, or code review advice when the transaction requires it.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Paid audits are processed through Stripe Checkout. A paid audit starts after checkout completion is confirmed by Stripe webhook.",
            "Pricing may change over time, but completed purchases remain tied to the amount shown at checkout.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Do not use DueDev to access repositories without authorization, bypass GitHub permissions, attack third-party systems, or upload malicious content.",
            "DueDev may refuse or disable access for abuse, fraud, or activity that creates operational or legal risk.",
          ],
        },
      ]}
    />
  );
}
