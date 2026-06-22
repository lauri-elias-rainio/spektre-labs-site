import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { SkipLink } from "@/components/a11y/skip-link";
import lab from "@/data/lab.json";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { getGlobalStructuredData } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: lab.name,
    template: `%s · ${lab.name}`,
  },
  alternates: {
    canonical: "/",
  },
  description: lab.subtext,
  applicationName: lab.name,
  category: "research",
  classification: "research laboratory",
  authors: [
    {
      name: lab.author,
      url: `https://orcid.org/${lab.orcid}`,
    },
  ],
  creator: lab.author,
  publisher: lab.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "Spektre Labs",
    "research laboratory",
    "complex systems",
    "structural invariants",
    "coherence theory",
    "collapse dynamics",
    "computational orchestration",
    "research artifacts",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: lab.name,
    description: lab.subtext,
    url: absoluteUrl("/"),
    siteName: lab.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: lab.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: lab.name,
    description: lab.subtext,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-white text-neutral-950 dark:bg-[#000000] dark:text-[#edf0f4]">
          <StructuredData data={getGlobalStructuredData()} />
          {/* Fixed decorative layers — aria-hidden, pointer-events none */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(23,23,23,0.03),transparent_18rem)] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.035),transparent_18rem)]"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-y-0 left-1/2 z-0 hidden w-full max-w-7xl -translate-x-1/2 lg:block"
          >
            <div className="absolute inset-y-0 left-0 w-px bg-neutral-200/70 dark:bg-neutral-800/70" />
            <div className="absolute inset-y-0 right-0 w-px bg-neutral-200/70 dark:bg-neutral-800/70" />
          </div>

          {/* Keyboard bypass — surfaces on first Tab keystroke */}
          <SkipLink targetId="main-content" />

          <div className="relative z-10">
            <Navigation />
          </div>
          <main
            id="main-content"
            tabIndex={-1}
            className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-32 pt-10 outline-none sm:px-10 sm:pb-40 sm:pt-14 lg:px-14 lg:pt-16"
          >
            {children}
          </main>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
