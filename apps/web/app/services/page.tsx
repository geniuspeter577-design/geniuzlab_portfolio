import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { CTASection } from "@/components/sections/CTASection";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: `What ${siteConfig.name} offers, by category.`,
};

/** Ported 1:1 from the mockup's pageServices(). No .frame wrapper — see
 * Hero.tsx note. */
export default function ServicesPage() {
  return (
    <>
      <section>
        <div className="category-heading site-container">
          <div className="category-heading-top">
            <span className="status-badge"><span aria-hidden="true" /> Active lab</span>
          </div>
          <h1>Our Services</h1>
          <p>Design work across the studio&apos;s existing disciplines. Each service connects to its live portfolio category.</p>
        </div>

        <div className="services site-container services-page-list">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="card">
              <div>
                <div className="card-title">{category.label}</div>
                <div className="card-sub">{category.description}</div>
              </div>
              <div className="card-photo">
                <PhotoIcon />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTASection heading="Tell me about your project and I'll get back to you." />
    </>
  );
}

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path
        d="m4 17 5-5 4 4 3-3 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
