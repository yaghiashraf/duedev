import { LegalPage } from "@/app/legal-content";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="April 17, 2026"
      intro="DueDev is built to assess repository risk without turning source code into a permanent data asset. This policy explains what we collect, why we collect it, and how we handle report data."
      sections={[
        {
          heading: "Information we collect",
          body: [
            "We collect account information provided through GitHub OAuth, including name, email, avatar, and repository access token when authorized.",
            "We collect audit metadata such as repository owner, repository name, audit type, payment status, risk score, findings, and generated report content.",
            "We do not intentionally store raw repository source code. Source files are read for analysis and converted into findings, scores, and summaries.",
          ],
        },
        {
          heading: "How we use information",
          body: [
            "We use repository access to generate requested audits, list repositories available to the signed-in user, and create report history.",
            "We use payment metadata to confirm checkout completion, trigger paid audits, and maintain audit status.",
            "We use operational logs to maintain reliability, debug failures, and protect the service from misuse.",
          ],
        },
        {
          heading: "Third-party processors",
          body: [
            "DueDev uses GitHub for repository authorization, Stripe for checkout and payment processing, Vercel for hosting, a Postgres provider for application data, and Anthropic for private audit analysis.",
            "Payment card details are handled by Stripe. DueDev does not store full card numbers.",
          ],
        },
        {
          heading: "Data retention",
          body: [
            "Reports and audit metadata are retained so users can access prior audit history and share seller reports.",
            "Users can request deletion of account and audit records by contacting the operator listed in the product footer or repository owner.",
          ],
        },
      ]}
    />
  );
}
