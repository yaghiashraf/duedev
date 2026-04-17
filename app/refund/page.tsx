import { LegalPage } from "@/app/legal-content";

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="April 17, 2026"
      intro="DueDev sells digital technical diligence reports. This policy explains how refunds are handled for one-time reports and monitoring plans."
      sections={[
        {
          heading: "One-time audit reports",
          body: [
            "If checkout succeeds but the audit cannot run because of a platform failure, contact support with the audit id and Stripe session id.",
            "If a report is generated successfully, refunds are not guaranteed because the digital service has been delivered.",
          ],
        },
        {
          heading: "Monitoring subscriptions",
          body: [
            "Monitoring subscriptions can be canceled for future billing periods through the account or by contacting support.",
            "Partial-month refunds are not guaranteed unless required by law or caused by service failure.",
          ],
        },
        {
          heading: "Duplicate payments",
          body: [
            "Duplicate checkout sessions for the same repository and audit type can be reviewed and refunded when the duplicate did not produce additional delivered value.",
          ],
        },
      ]}
    />
  );
}
