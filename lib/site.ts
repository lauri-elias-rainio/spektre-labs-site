import type { Metadata } from "next";

import lab from "@/data/lab.json";

function getSiteUrlString() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!configuredUrl) {
    return "http://localhost:3000";
  }

  return configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;
}

export const siteUrl = new URL(getSiteUrlString());

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const ogImagePath =
    normalizedPath === "/" ? "/opengraph-image" : `${normalizedPath}/opengraph-image`;

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
