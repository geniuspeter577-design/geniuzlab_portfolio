import { siteConfig, socialLinks, whatsappHref } from "@/lib/constants";

export function ContactPreview() {
  return (
    <section id="contact" className="section">
      <div className="site-container contact-panel contact-grid">
        <div>
          <p className="section-kicker">Start a conversation</p>
          <h2 className="section-title">Have a project in mind?</h2>
          <p className="section-lead">Tell me what you are building, what it needs to do, and where you want it to go.</p>
          <div className="button-row">
            <a href={`mailto:${siteConfig.email}`} className="button-primary">Email me</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button-secondary">WhatsApp</a>
          </div>
        </div>
        <div className="contact-details">
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          {siteConfig.phones.map((phone) => <a key={phone} href={`tel:${phone}`}>{phone}</a>)}
          {socialLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}: {link.handle}</a>)}
        </div>
      </div>
    </section>
  );
}
