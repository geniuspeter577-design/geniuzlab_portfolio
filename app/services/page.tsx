import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { CTASection } from "@/components/sections/CTASection";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: `What ${siteConfig.name} offers, by category.`,
};

export default function ServicesPage() {
  return (
    <>
      <div className="container-editorial pt-16 pb-10">
        <p className="eyebrow text-brass">Services</p>
        <h1 className="mt-3 max-w-2xl font-display text-display">What I offer</h1>
        <p className="mt-4 max-w-xl text-lead text-ink-muted">
          Design work across seven areas. Each links through to the relevant
          portfolio category.
        </p>
      </div>

      <div className="container-editorial section-padding pt-0">
        <ul>
          {categories.map((category, index) => (
            <li key={category.slug} className="border-t border-line last:border-b">
              <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="flex items-baseline gap-5">
                  <span className="eyebrow text-ink-muted">0{index + 1}</span>
                  <span className="font-display text-display leading-none group-hover:text-brass">
                    {category.label}
                  </span>
                </span>
                <span className="max-w-md text-sm text-ink-muted sm:text-right">
                  {category.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <CTASection
        eyebrow="Rates & availability"
        heading="Tell me about your project and I'll get back to you."
      />
    </>
  );
}
