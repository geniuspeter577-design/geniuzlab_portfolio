import type { Metadata } from "next";
import { siteConfig, socialLinks, whatsappHref } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

/**
 * Ported 1:1 from the mockup's pageSupport(): page-heading, one page-sub
 * paragraph, and a cta-row with a solid .cta ("Email me") and a .cta-ghost
 * ("WhatsApp me"). The mockup's own version also has an .assumption note
 * asking for your real email/phone/handles — dropped here since you
 * already have real values for those (siteConfig), so there's nothing
 * left to ask for.
 *
 * The phone numbers and social links below aren't in the mockup's
 * pageSupport() at all — it only shows the two CTA buttons. I kept them
 * since they're real, working parts of your site, styled to match
 * (page-sub / chip), rather than deleting real functionality to make the
 * page shorter than the mockup.
 */
export default function ContactPage() {
  return (
    <section>
      <h1 className="page-heading">Let&apos;s talk about your project.</h1>
      <p className="page-sub">
        The fastest way to reach me is by email or WhatsApp. Include a bit
        about the project, timeline, and budget if you have one in mind.
      </p>

      <div className="cta-row" style={{ marginBottom: 24 }}>
        <a href={`mailto:${siteConfig.email}`} className="cta">
          Email me
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="cta-ghost">
          WhatsApp me
        </a>
      </div>

      <div className="chip-row">
        {siteConfig.phones.map((phone) => (
          <a key={phone} href={`tel:${phone}`} className="chip">
            {phone}
          </a>
        ))}
        {socialLinks.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="chip">
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
