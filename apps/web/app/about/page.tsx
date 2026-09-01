import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/sections/CTASection";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.founder}, the designer behind ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <>
      <div className="container-editorial pt-12 pb-8 sm:pt-16 sm:pb-10">
        <p className="eyebrow text-brass">About</p>
        <h1 className="mt-4 max-w-3xl font-display text-display">{siteConfig.founder}</h1>
        <p className="eyebrow mt-4 text-ink-muted">{siteConfig.founderTitle}</p>
      </div>

      <div className="container-editorial section-padding pt-0">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
              <Image
                src="/images/placeholder.svg"
                alt="Placeholder portrait — replace with a real photo"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <p className="eyebrow inline-block border border-brass/40 px-3 py-1.5 text-brass w-fit">
              Placeholder copy — replace with your real bio
            </p>
            <p className="mt-6 text-lead leading-relaxed">
              [Placeholder] Write a short, confident introduction here — who you
              are, how you got into design, and the kind of work you focus on
              today.
            </p>
            <p className="mt-6 leading-relaxed text-ink-muted">
              [Placeholder] Add a second paragraph on your approach or process:
              how you work with clients, what you care about visually, and what
              a project with you looks like from start to finish.
            </p>
          </div>
        </div>
      </div>

      <CTASection
        eyebrow="Work with me"
        heading="Ready to start a project?"
      />
    </>
  );
}
