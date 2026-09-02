// Single source of truth lives in packages/shared — re-exported here so
// existing "@/lib/constants" imports across apps/web keep working.
export { siteConfig, mainNav, whatsappHref, socialLinks } from "@geniuzlab/shared";
