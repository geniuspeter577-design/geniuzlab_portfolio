import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { siteConfig, socialLinks, whatsappHref } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container-editorial section-padding pt-12 sm:pt-24">
      <p className="eyebrow text-brass">Contact</p>
      <h1 className="mt-4 max-w-2xl font-display text-hero leading-[0.95]">
        Let&apos;s talk about your project.
      </h1>
      <p className="mt-8 max-w-lg text-lead text-ink-muted">
        The fastest way to reach me is by email or WhatsApp. Include a bit
        about the project, timeline, and budget if you have one in mind.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Button href={`mailto:${siteConfig.email}`} variant="primary">
          {siteConfig.email}
        </Button>
        <Button href={whatsappHref} variant="ghost" target="_blank" rel="noopener noreferrer">
          Message on WhatsApp
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-10 sm:grid-cols-3">
        <div>
          <p className="eyebrow text-ink-muted">Phone</p>
          <ul className="mt-4 flex flex-col gap-2">
            {siteConfig.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone}`} className="text-sm hover:text-brass">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-muted">WhatsApp</p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-brass">
                {siteConfig.whatsapp}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-muted">Elsewhere</p>
          <ul className="mt-4 flex flex-col gap-2">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brass"
                >
                  {link.label} — <span className="text-ink-muted">{link.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
