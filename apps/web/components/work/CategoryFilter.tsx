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
    <nav aria-label="Filter by category" className="category-filter">
      <ul className="site-container">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.slug}>
              <Link
                href={item.href}
                className={cn(
                  "category-chip",
                  isActive 
                    ? "is-active"
                    : ""
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
