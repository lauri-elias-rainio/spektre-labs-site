import lab from "@/data/lab.json";
import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Computational orchestration",
    title: lab.method.title,
    description: lab.method.description,
    footer: "Spektre Labs",
  });
}

