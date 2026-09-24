import Script from "next/script";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider, themeInitScript } from "@/components/ui/ThemeProvider";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const brandFont = Geist({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${brandFont.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="site-body">
        <ThemeProvider>
          <div className="site-shell">
            <Navigation />
            <main className="site-main">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
