import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DueDev — Technical Due Diligence for SaaS",
  description:
    "AI-powered code audits for SaaS acquisitions. Get a risk score, tech debt estimate, and acquisition recommendation before you buy — or prove your codebase is clean before you sell.",
  openGraph: {
    title: "DueDev — Technical Due Diligence for SaaS",
    description: "AI-powered code audits for SaaS acquisitions.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#080a09] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
