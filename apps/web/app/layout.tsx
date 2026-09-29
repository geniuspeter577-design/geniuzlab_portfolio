import Script from "next/script";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navigation } from "@/components/layout/Navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider, themeInitScript } from "@/components/ui/ThemeProvider";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const brandFont = localFont({
  src: [
    { path: "../public/fonts/general-sans-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/general-sans-semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-general-sans",
});
const heroFont = localFont({
  src: "../public/fonts/creato-display-regular.otf",
  variable: "--font-creato-display",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.experienceName} — ${siteConfig.founder}`,
    template: `%s — ${siteConfig.experienceName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/brand/geniuzlab-mark.png",
  },
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
      className={`${brandFont.variable} ${heroFont.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="site-body">
        <ThemeProvider>
          <div className="site-shell">
            <Navigation />
            <main className="site-main">{children}</main>
          </div>
          <BottomNav />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
