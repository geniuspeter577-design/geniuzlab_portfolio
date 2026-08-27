/**
 * Site-wide constants: brand copy, navigation, and metadata defaults.
 * Kept in one place so nav/footer/SEO stay consistent and easy to update.
 */

export const siteConfig = {
  /** Official brand name. */
  name: "GENIUZLAB",
  /** The portfolio experience — used for the hero and page titles. */
  experienceName: "GENIUZLAB EXPERIENCE",
  founder: "Otsaje Genius Peter",
  founderTitle: "CEO, GENIUZLAB",
  tagline: "Design that holds attention.",
  description:
    "GENIUZLAB EXPERIENCE — the portfolio of Otsaje Genius Peter, CEO of GENIUZLAB. Graphic design, branding, church & Christian design, social media, motion, and client projects.",
  email: "geniuzlab577@gmail.com",
  phones: ["09138955730", "09011141389"],
  whatsapp: "09138955730",
};

export const mainNav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

/** wa.me expects a full international number with no leading zero/symbols. */
export const whatsappHref = `https://wa.me/234${siteConfig.whatsapp.replace(/^0/, "")}`;

/**
 * Official public social profiles. Instagram and TikTok links are built
 * directly from the handles provided for this brand. The Facebook link is
 * a best-effort URL built from the page name "Geniuz Lab" — double-check
 * it points at the real page and update here if the slug differs.
 */
export const socialLinks: { label: string; href: string; handle: string }[] = [
  { label: "Facebook", href: "https://facebook.com/GeniuzLab", handle: "Geniuz Lab" },
  { label: "Instagram", href: "https://instagram.com/geniuz_lab", handle: "@geniuz_lab" },
  { label: "TikTok", href: "https://www.tiktok.com/@geniuzlab", handle: "Geniuzlab" },
];
