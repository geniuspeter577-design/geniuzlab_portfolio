"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { Reveal } from "@/components/ui/Reveal";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/**
 * "The Index" — the site's signature element.
 *
 * Styled as a magazine contents page rather than a card grid: a running,
 * genuinely meaningful numbered list (these ARE the seven sections of the
 * site, in order) with a large serif category name and, on desktop, a
 * cover image that swaps in as each row is hovered. This is the one place
 * the design takes a visible risk — everything around it stays quiet.
 */
export function CategoryShowcase() {
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);

  return (
    <section className="section-padding border-t-2 border-brass/40">
      <div className="container-editorial">
        <Reveal>
          <p className="eyebrow text-brass">The Index</p>
          <h2 className="mt-4 font-display text-display">Seven ways into the work</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <ul className="lg:col-span-7 space-y-0" onMouseLeave={() => setActiveSlug(categories[0].slug)}>
            {categories.map((category, index) => (
              <li key={category.slug} className="border-t border-line/50 last:border-b hover:border-t-brass/50 transition-colors">
                <Link
                  href={`/category/${category.slug}`}
                  onMouseEnter={() => setActiveSlug(category.slug)}
                  className="group flex items-baseline justify-between gap-6 py-6 transition-all"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="eyebrow shrink-0 text-ink-muted font-semibold">0{index + 1}</span>
                    <span className="min-w-0 break-words font-display text-index leading-[1.05] group-hover:text-brass transition-colors">
                      {category.label}
                    </span>
                  </span>
                  <span className="eyebrow hidden shrink-0 text-ink-muted/70 opacity-0 transition-all group-hover:opacity-100 sm:block font-semibold text-brass/60">
                    View →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-center">
            <div className="relative sticky top-28">
              <div className="aspect-[4/5] w-full overflow-hidden bg-surface border border-line/50 rounded-sm">
                {categories.map((category) => (
                  <Image
                    key={category.slug}
                    src={PLACEHOLDER_IMAGE}
                    alt={`${category.label} — placeholder cover image`}
                    fill
                    sizes="40vw"
                    className={`object-cover transition-opacity duration-500 ease-[var(--ease-cinema)] ${
                      activeSlug === category.slug ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
