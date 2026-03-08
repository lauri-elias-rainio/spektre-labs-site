import lab from "@/data/lab.json";
import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: lab.name,
    title: lab.name,
    description: lab.tagline,
    footer: lab.location,
  });
}

