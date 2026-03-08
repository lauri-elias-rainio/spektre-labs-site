import lab from "@/data/lab.json";
import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Spektre Labs",
    title: "About",
    description: lab.about.description,
    footer: `${lab.author} · ${lab.location}`,
  });
}

