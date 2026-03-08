import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Artifacts",
    title: "Artifacts",
    footer: "Spektre Labs",
  });
}

