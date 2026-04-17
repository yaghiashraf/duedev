import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoLockup } from "@/app/brand";

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <main className="min-h-screen bg-[#080a09] text-white">
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <LogoLockup markClassName="h-8 w-8" />
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </nav>
      <article className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">DueDev</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {updated}</p>
        <p className="mt-6 text-base leading-7 text-zinc-300">{intro}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="professional-card rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-zinc-400">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
