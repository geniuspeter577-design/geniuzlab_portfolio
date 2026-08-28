"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Tracks the pathname the overlay state was last computed for, so we can
  // close the overlay on navigation by adjusting state during render
  // (React's recommended alternative to setState-in-effect for this case)
  // instead of synchronizing it after the fact in a useEffect.
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Lock background scroll while the mobile overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/*
        Persistent chrome is kept in the dark "cinema" treatment (rather than
        the light "paper" treatment it used before) for two reasons: the
        official logo file is white/green and only reads correctly against a
        dark background, and a dark nav + dark footer bookends every page in
        the same premium, cinematic register the brief asks for.
      */}
      <header className="sticky top-0 z-50 border-b border-cinema-line bg-cinema/95 text-cinema-ink shadow-[0_1px_0_rgba(126,217,87,0.15)] backdrop-blur-sm">
        <div className="container-editorial flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="shrink-0"
            onClick={() => setOpen(false)}
            aria-label="GENIUZLAB — home"
          >
            <Image
              src="/images/brand/geniuzlab-logo-full.png"
              alt="GENIUZLAB"
              width={2726}
              height={844}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`eyebrow border-b border-transparent pb-1 transition-colors hover:text-brass ${
                    isActive ? "border-brass text-brass" : "text-cinema-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-cinema-ink transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-cinema-ink transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
