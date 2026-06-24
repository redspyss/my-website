import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Providers from "@/components/Providers";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.meta.title,
    template: `%s · ${site.meta.title}`,
  },
  description: site.meta.description,
  keywords: site.meta.keywords,
  authors: [{ name: site.yourName }],
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#04060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${display.variable} ${serif.variable}`}>
      <body className="nox-mode">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
