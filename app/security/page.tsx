import { LegalPage } from "@/app/legal-content";

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      updated="April 17, 2026"
      intro="DueDev handles sensitive repository metadata and acquisition context. The product is designed to minimize raw source-code retention and keep paid audit workflows explicit."
      sections={[
        {
          heading: "Repository access",
          body: [
            "Private repository access uses GitHub OAuth and the permissions granted by the signed-in user.",
            "Repository files are read to produce report findings. DueDev stores report data, not raw source-code snapshots.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Stripe handles card collection and payment processing. Checkout sessions include audit metadata so paid events can be matched to the correct report.",
            "Webhook verification is required before an audit is marked paid and started.",
          ],
        },
        {
          heading: "Operational controls",
          body: [
            "Environment variables are used for GitHub, Stripe, database, and AI provider credentials.",
            "The app is configured to fail with clear errors when critical checkout configuration is missing.",
          ],
        },
        {
          heading: "Responsible disclosure",
          body: [
            "If you believe you found a security issue, avoid accessing data that is not yours and contact the operator with reproduction details.",
            "Include affected route, impact, reproduction steps, and any safe proof-of-concept details.",
          ],
        },
      ]}
    />
  );
}
