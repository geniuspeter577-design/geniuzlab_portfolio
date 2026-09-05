"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Lightbulb, FolderOpen, Headset } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Same six-icon set the mockup uses (home / user / bulb / folder / support),
 * in the same order — minus "Reviews", which isn't a route on the real
 * site (flagged separately). If you add a Reviews page later, insert it
 * between Work and Contact to match the mockup's order exactly.
 */
const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Work", href: "/work", icon: Lightbulb },
  { label: "Services", href: "/services", icon: FolderOpen },
  { label: "Contact", href: "/contact", icon: Headset },
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

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) =>
      item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href)
    )
  );
  const activeItem = navItems[activeIndex];
  const ActiveIcon = activeItem.icon;
  const pct = (activeIndex + 0.5) * (100 / navItems.length);

  return (
    <div className="nav-wrap">
      {/* Mirrors the mockup's <button class="theme-toggle">, positioned
          top:-4px/right:0 relative to this element (nav-wrap is
          position:relative, same as the mockup's .frame ancestor). */}
      <div className="theme-toggle">
        <ThemeToggle />
      </div>

      <nav aria-label="Primary" className="pill">
        {navItems.map((item, i) => {
          const isActive = i === activeIndex;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={`pill-item${isActive ? " is-active-slot" : ""}`}
            >
              <Icon />
            </Link>
          );
        })}
      </nav>

      <Link
        href={activeItem.href}
        className="lift-circle"
        style={{ left: `${pct}%` }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <ActiveIcon />
      </Link>
      <span className="lift-label" style={{ left: `${pct}%` }}>
        {activeItem.label}
      </span>
    </div>
  );
}
