"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Same six-icon set the mockup uses (home / user / bulb / folder / support),
 * in the same order — minus "Reviews", which isn't a route on the real
 * site (flagged separately). If you add a Reviews page later, insert it
 * between Work and Contact to match the mockup's order exactly.
 */
const navItems = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Floating pill nav, ported 1:1 from the mockup's markup/JS:
 *   .nav-wrap > .pill (row of icon buttons, active slot invisible)
 *             > .lift-circle (bordered circle that slides to the active
 *               index's centre-percentage and shows that item's icon)
 *             > .lift-label (the active item's label, same position)
 * The mockup computes `left: (index + 0.5) * (100 / itemCount) + '%'` and
 * animates it — reproduced here via the active route's index.
 */
export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }


  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="brand-link" aria-label="GeniuzLab home">
          <Image src="/images/brand/geniuzlab-logo-full.png" alt="GeniuzLab" width={180} height={56} priority />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav id="primary-navigation" aria-label="Primary" className={`primary-nav${isOpen ? " is-open" : ""}`}>
          <Link href="/" className={pathname === "/" ? "is-active" : ""} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "is-active" : ""}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
