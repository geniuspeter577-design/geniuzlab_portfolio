"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, siteConfig, whatsappHref } from "@/lib/constants";
import { categories } from "@/lib/categories";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile navigation overlay. Deliberately styled in the
 * "cinema" (dark) palette — it reads as a distinct, immersive moment
 * rather than a generic dropdown menu.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={`cinema-grain fixed inset-0 z-40 flex flex-col overflow-y-auto bg-cinema text-cinema-ink transition-opacity duration-500 ease-[var(--ease-cinema)] md:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="container-editorial flex min-h-full flex-1 flex-col justify-between py-8">
        <nav aria-label="Mobile" className="mt-20 flex flex-col gap-2">
          {mainNav.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 border-b border-cinema-line py-4"
              >
                <span className="eyebrow text-cinema-muted">0{index + 1}</span>
                <span
                  className={`font-display text-4xl transition-colors ${
                    isActive ? "text-brass-dim" : "text-cinema-ink group-hover:text-brass-dim"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 flex flex-col gap-4">
          <p className="eyebrow text-cinema-muted">Categories</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={onClose}
                className="text-sm text-cinema-muted hover:text-cinema-ink"
              >
                {category.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-cinema-line pt-6">
            <a href={`mailto:${siteConfig.email}`} className="eyebrow text-cinema-muted hover:text-cinema-ink">
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phones[0]}`} className="eyebrow text-cinema-muted hover:text-cinema-ink">
              {siteConfig.phones[0]}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-cinema-muted hover:text-cinema-ink"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
