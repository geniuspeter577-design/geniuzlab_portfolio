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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <ThemeProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
