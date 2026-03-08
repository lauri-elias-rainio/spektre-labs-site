import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Research Map",
    title: "Research",
    footer: "Spektre Labs",
  });
}

