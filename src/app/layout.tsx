import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { site } from "@/content/site";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

// Fonts are downloaded at build time and served from our own domain (no layout shift, no Google request).
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const description =
  "Nature-led resorts in Kerala's hills, forests and rivers. Stay at Blanket Days in Thekkady, Blanket Riverside and Blanket Hotel & Spa in Munnar. Book direct for the best rate.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Blanket Hotels & Resorts | Luxury Nature Resorts in Munnar & Thekkady, Kerala",
    template: "%s | Blanket Hotels & Resorts",
  },
  description,
  keywords: [
    "resorts in Munnar",
    "resorts in Thekkady",
    "luxury resort Kerala",
    "riverside resort Munnar",
    "nature resort Thekkady",
    "Blanket Hotels",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: "Blanket Hotels & Resorts — Stay inside the landscape",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blanket Hotels & Resorts — Stay inside the landscape",
    description,
  },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#14231B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
