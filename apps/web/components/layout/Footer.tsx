"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { mainNav, siteConfig, socialLinks, whatsappHref } from "@/lib/constants";

/**
 * NOTE: the mockup has no footer at all — its SPA ends with a single
 * `<p class="note">`. There's nothing to port 1:1 here, so this keeps your
 * existing footer's structure/content but restyles it with the mockup's
 * light background, --surface cards, and green accent instead of the old
 * dark "cinema" block, so it doesn't clash with the rest of the site.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div>
            <Link href="/" className="brand-link footer-brand" aria-label="GeniuzLab home">
              <Image src="/images/brand/geniuzlab-logo-full.png" alt="GeniuzLab" width={180} height={56} />
            </Link>
            <p className="footer-copy">Make work worth a second look.</p>
            <a href={`mailto:${siteConfig.email}`} className="footer-email">{siteConfig.email}</a>
          </div>
          <nav aria-label="Footer navigation">
            <p className="footer-label">Explore</p>
            <ul className="footer-links">
              {mainNav.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <p className="footer-label">Connect</p>
            <ul className="footer-links">
              <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              {socialLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} {siteConfig.name}. {siteConfig.founder}.</p>
          <a href={`tel:${siteConfig.phones[0]}`}>{siteConfig.phones[0]}</a>
        </div>
      </div>
    </footer>
  );
}
