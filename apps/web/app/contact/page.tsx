import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { socialLinks, whatsappHref } from "@/lib/constants";

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
    <section className="contact-page">
      <div className="contact-page-title-row">
        <h1>Let&apos;s create something remarkable.</h1>
        <ArrowUpRight aria-hidden="true" size={28} />
      </div>
      <div className="section-underline" />
      <div className="contact-direct-channels" aria-label="Direct contact channels">
        <a href={`mailto:${siteConfig.email}`}>Email <span>{siteConfig.email}</span></a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp <span>{siteConfig.phones[0]}</span></a>
        {socialLinks.slice(0, 1).map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span>{link.handle}</span></a>)}
      </div>
      <p className="contact-intro">Tell us what you are building, who it is for, and what a good outcome looks like. We will reply to your brief directly.</p>
      <ContactForm />
    </section>
  );
}
