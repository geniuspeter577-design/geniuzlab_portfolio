"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, siteConfig, socialLinks, whatsappHref } from "@/lib/constants";
import { categories } from "@/lib/categories";

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
    <footer style={{ borderTop: "1px solid var(--nav-border)", background: "var(--bg)" }}>
      <div className="frame">
        <div
          style={{
            display: "grid",
            gap: 32,
            paddingBottom: 32,
            borderBottom: "1px solid var(--nav-border)",
          }}
        >
          <div>
            <p className="page-sub" style={{ margin: "0 0 12px", fontWeight: 800, color: "var(--heading)" }}>
              Make work worth a second look.
            </p>
            <a href={`mailto:${siteConfig.email}`} className="chip" style={{ display: "inline-block" }}>
              {siteConfig.email}
            </a>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              <a href={`tel:${siteConfig.phones[0]}`}>{siteConfig.phones[0]}</a>
              <a href={`tel:${siteConfig.phones[1]}`}>{siteConfig.phones[1]}</a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, margin: "0 0 10px" }}>
              Menu
            </p>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: 14 }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Categories">
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, margin: "0 0 10px" }}>
              Categories
            </p>
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`} style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            paddingTop: 20,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <p>
            © {year} {siteConfig.name}. {siteConfig.founder}.
          </p>
          {socialLinks.length > 0 && (
            <ul style={{ display: "flex", gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
