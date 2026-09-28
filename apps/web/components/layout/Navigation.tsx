"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { mainNav } from "@/lib/constants";

export function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="brand-link" aria-label="GeniuzLab home">
          <Image src="/images/brand/geniuzlab-logo-full.png" alt="GeniuzLab" width={180} height={56} priority />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {mainNav.map((item) => {
            const isActive = item.href === "/work"
              ? pathname === "/work" || pathname?.startsWith("/work/") || pathname?.startsWith("/category/")
              : pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className={isActive ? "is-active" : undefined} aria-current={isActive ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link href="/search" className="icon-button" aria-label="Search projects" title="Search projects">
            <Search aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="theme-toggle icon-button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
