"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * Category navigation for /work and /category/[category].
 * Implemented as real links to real routes (not client-side filtering) so
 * every category has its own crawlable, shareable URL — and so this reads
 * straight from a future CMS query with no behaviour change.
 */
export function CategoryFilter() {
  const pathname = usePathname();

  const items = [{ slug: "all", label: "All Work", href: "/work" }, ...categories.map((c) => ({
    slug: c.slug,
    label: c.label,
    href: `/category/${c.slug}`,
  }))];

  return (
    <nav aria-label="Filter by category" className="border-y border-line/50">
      <ul className="container-editorial flex flex-wrap gap-x-6 gap-y-4 py-6">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                className={cn(
                  "eyebrow transition-all hover:text-brass font-semibold",
                  isActive 
                    ? "text-brass border-b-2 border-brass pb-1" 
                    : "text-ink-muted border-b-2 border-transparent pb-1 hover:border-brass/50"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
