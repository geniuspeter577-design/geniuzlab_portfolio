import Link from "next/link";

interface CTASectionProps {
  heading?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/**
 * Ported 1:1 from the mockup's repeated closing block (appears at the end
 * of Home, Services, and About): an h2 heading followed by a single solid
 * .cta button. No eyebrow/email line — the mockup doesn't have one here.
 * No .frame wrapper — see Hero.tsx note.
 */
export function CTASection({
  heading = "Have a project in mind?",
  buttonLabel = "Start a project",
  buttonHref = "/contact",
}: CTASectionProps) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: "0 0 10px",
          color: "var(--heading)",
        }}
      >
        {heading}
      </h2>
      <Link href={buttonHref} className="cta">
        {buttonLabel}
      </Link>
    </section>
  );
}
