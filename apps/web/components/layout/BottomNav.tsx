"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, House, Mail, Sparkles } from "lucide-react";

const items = [
  { label: "Home", href: "/", Icon: House },
  { label: "Work", href: "/work", Icon: BriefcaseBusiness },
  { label: "Services", href: "/services", Icon: Sparkles },
  { label: "Contact", href: "/contact", Icon: Mail },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ label, href, Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-link${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
          >
            <span className="bottom-nav-icon"><Icon aria-hidden="true" /></span>
            <span className="bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}