import Script from "next/script";
import Image from "next/image";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider, themeInitScript } from "@/components/ui/ThemeProvider";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Stand-in for the brand's Creato Display typeface. No licensed Creato
 * Display font files exist in this project, and this is a static site
 * (no font-hosting service), so a close, freely-licensed geometric sans
 * is used here instead. Swap to real Creato Display later by loading it
 * with next/font/local and pointing --font-creato-display at it — every
 * heading in the site reads this one variable via app/globals.css.
 */
const creatoDisplayFallback = Outfit({
  variable: "--font-creato-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.experienceName} — ${siteConfig.founder}`,
    template: `%s — ${siteConfig.experienceName}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-theme is set by the inline script below before first paint —
      // suppressHydrationWarning tells React not to complain that the
      // server-rendered attribute (absent) doesn't match the client value
      // the script just set.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${creatoDisplayFallback.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <ThemeProvider>
          {/* Ported 1:1 from the mockup's <div class="logo-watermark">
              pair: a big, low-opacity, rotated wordmark fixed behind the
              content. The mockup embeds its own placeholder art here — we
              use the site's real logo files instead, since that's the
              actual brand mark, not the mockup's generic drawing. */}
          <div className="logo-watermark">
            <Image src="/images/brand/geniuzlab-logo-full.png" alt="" width={2726} height={844} />
          </div>

          {/* Ported 1:1 from the mockup's single <div class="frame">,
              which is the ONE narrow (460px / 880px) centred column that
              wraps the nav and every page's content. Individual page
              components no longer wrap themselves in .frame — they render
              directly inside this one, matching the mockup's structure
              exactly instead of nesting frames inside frames. */}
          <div className="frame" style={{ flex: 1 }}>
            <Navigation />
            <main>{children}</main>
          </div>

          {/* The mockup has no footer at all — kept outside .frame since
              it's a full-width addition, not part of the mockup to copy. */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
