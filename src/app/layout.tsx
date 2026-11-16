import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.tagline,
  openGraph: { title: site.name, description: site.tagline, type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b2a20" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-flag focus:px-4 focus:py-2 focus:font-display focus:text-ink"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Cursor />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
