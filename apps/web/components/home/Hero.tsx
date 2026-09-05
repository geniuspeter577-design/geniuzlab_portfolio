import Link from "next/link";
import { siteConfig } from "@/lib/constants";

/**
 * Ported 1:1 from the mockup's pageHome(): a page-heading, one intro
 * paragraph (page-sub), and a cta-row with a solid .cta button plus a
 * .cta-ghost outline button — replacing the previous full-bleed dark
 * "cinema" hero. Uses plain <Link> with the mockup's own .cta/.cta-ghost
 * classes rather than the site's Button component, since that component's
 * variant styling isn't in this file set and shouldn't be assumed.
 * No .frame wrapper here — app/layout.tsx now provides the single outer
 * .frame all pages share, matching the mockup's one-frame structure.
 */
export function Hero() {
  return (
    <section>
      <h1 className="page-heading">{siteConfig.experienceName}</h1>
      <p className="page-sub">
        {siteConfig.tagline} A design studio working across branding, church
        &amp; Christian design, social media, print, and motion — built to
        make real work easy to explore.
      </p>
      <div className="cta-row" style={{ marginBottom: 28 }}>
        <Link href="/work" className="cta">
          View the work
        </Link>
        <Link href="/services" className="cta-ghost">
          See services
        </Link>
      </div>
    </section>
  );
}
