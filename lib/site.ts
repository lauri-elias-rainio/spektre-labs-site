import type { Metadata } from "next";

import lab from "@/data/lab.json";

function getSiteUrlString() {
  // Canonical host is spektre.org — spektrelabs.org and both www hosts 308
  // there. Canonical/OG/sitemap URLs must never point at a redirecting host.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const u = process.env.NEXT_PUBLIC_SITE_URL;
    return u.startsWith("http") ? u : `https://${u}`;
  }
  if (process.env.VERCEL_ENV === "production" || !process.env.VERCEL_URL) {
    return "https://spektre.org";
  }
  const u = process.env.VERCEL_URL;
  return u.startsWith("http") ? u : `https://${u}`;
}

export const siteUrl = new URL(getSiteUrlString());

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

// routes that ship a real per-route opengraph-image; everything else falls back to the root card
const OG_ROUTES = new Set(["/", "/about", "/research", "/method", "/artifacts", "/token", "/sigma"]);

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string; // override OG with a real asset (e.g. on-canon Imagen concept art)
}): Metadata {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const hasOgRoute =
    OG_ROUTES.has(normalizedPath) || normalizedPath.startsWith("/artifacts/");
  const ogImagePath = image
    ? image
    : hasOgRoute
      ? normalizedPath === "/"
        ? "/opengraph-image"
        : `${normalizedPath}/opengraph-image`
      : "/opengraph-image"; // safe default — the new pages had broken OG routes

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(normalizedPath),
      siteName: lab.name,
      locale: "en_US",
      type,
      images: [
        {
          url: absoluteUrl(ogImagePath),
          width: 1200,
          height: 630,
          alt: `${title} · ${lab.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImagePath)],
    },
  };
}
