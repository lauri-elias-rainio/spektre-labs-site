import type { MetadataRoute } from "next";

import { getArtifacts } from "@/lib/artifacts";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/universe", priority: 0.9, changeFrequency: "monthly" },
    { path: "/artifacts", priority: 0.9, changeFrequency: "monthly" },
    { path: "/research", priority: 0.8, changeFrequency: "monthly" },
    { path: "/systems", priority: 0.8, changeFrequency: "monthly" },
    { path: "/studio", priority: 0.8, changeFrequency: "monthly" },
    { path: "/method", priority: 0.8, changeFrequency: "monthly" },
    { path: "/manifesto", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/connect", priority: 0.6, changeFrequency: "yearly" },
    { path: "/press", priority: 0.5, changeFrequency: "yearly" },
    { path: "/corpus", priority: 0.8, changeFrequency: "monthly" },
    { path: "/shoreworld", priority: 0.6, changeFrequency: "monthly" },
    { path: "/llms.txt", priority: 0.4, changeFrequency: "monthly" },
  ];

  const artifactRoutes = getArtifacts().map((artifact) => ({
    path: `/artifacts/${artifact.slug}`,
    priority: artifact.prominence === "primary" ? 0.9 : 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...artifactRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

