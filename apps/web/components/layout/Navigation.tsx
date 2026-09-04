"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Lightbulb, FolderOpen, Headset } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Services", href: "/services", icon: Lightbulb },
  { label: "Work", href: "/work", icon: FolderOpen },
  { label: "Contact", href: "/contact", icon: Headset },
] as const;

/**
 * Floating pill navigation. Icon-only for inactive items, icon + label for
 * the active route — the same compact, always-visible treatment at every
 * breakpoint (no separate hamburger/mobile overlay), matching the brand's
 * reference design. Stays in the dark "cinema" chrome deliberately: the
 * wordmark/icons only read correctly on dark, and it bookends every page
 * regardless of the light/dark content theme.
 */
export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-3 z-50 flex justify-center px-3 sm:top-4">
      <nav
        aria-label="Primary"
        className="flex max-w-full items-center gap-1 rounded-full border border-cinema-line bg-cinema/90 px-2 py-2 text-cinema-ink shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(126,217,87,0.08)] backdrop-blur-xl sm:gap-1.5"
      >
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="mr-1 hidden shrink-0 items-center pl-2 pr-1 sm:flex"
        >
          <span className="font-display text-sm font-semibold tracking-tight text-brass">
            {siteConfig.name.slice(0, 1)}
          </span>
        </Link>

        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-3.5 ${
                isActive
                  ? "bg-brass text-cinema shadow-[0_2px_12px_-2px_rgba(126,217,87,0.5)]"
                  : "text-cinema-muted hover:bg-white/10 hover:text-cinema-ink"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              <span className={isActive ? "inline" : "hidden sm:inline"}>{item.label}</span>
            </Link>
          );
        })}

        <div className="ml-1 border-l border-cinema-line pl-1.5">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
