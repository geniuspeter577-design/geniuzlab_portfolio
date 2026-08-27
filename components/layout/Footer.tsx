import Image from "next/image";
import Link from "next/link";
import { mainNav, siteConfig, socialLinks, whatsappHref } from "@/lib/constants";
import { categories } from "@/lib/categories";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="cinema-grain bg-cinema text-cinema-ink">
      <div className="container-editorial section-padding">
        <div className="grid grid-cols-1 gap-12 border-b border-cinema-line pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/images/brand/geniuzlab-logo-full.png"
              alt="GENIUZLAB"
              width={2726}
              height={844}
              className="h-8 w-auto"
            />
            <p className="mt-8 font-display text-3xl leading-tight">
              Let&apos;s build something worth looking twice at.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="eyebrow mt-6 inline-block border-b border-brass-dim pb-1 text-brass-dim hover:text-cinema-ink"
            >
              {siteConfig.email}
            </a>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cinema-muted">
              <a href={`tel:${siteConfig.phones[0]}`} className="hover:text-cinema-ink">
                {siteConfig.phones[0]}
              </a>
              <a href={`tel:${siteConfig.phones[1]}`} className="hover:text-cinema-ink">
                {siteConfig.phones[1]}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-cinema-ink">
                WhatsApp
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-cinema-muted">Menu</p>
            <ul className="mt-4 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-brass-dim">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Categories" className="md:col-span-4">
            <p className="eyebrow text-cinema-muted">Categories</p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-cinema-muted hover:text-cinema-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs text-cinema-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {siteConfig.founder}.
          </p>
          {socialLinks.length > 0 && (
            <ul className="flex gap-6">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cinema-ink"
                  >
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
