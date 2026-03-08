import type { MetadataRoute } from "next";

import lab from "@/data/lab.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: lab.name,
    short_name: "Spektre",
    description: lab.subtext,
    start_url: "/",
    display: "standalone",
    categories: ["research", "science", "education"],
    lang: "en",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

