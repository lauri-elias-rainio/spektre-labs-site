import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "Token · Proof of Reserve",
    title: "SPEKTRE",
    description: "31,000 satoshis. 31,000 units.\nMachine-verifiable in your browser.",
    footer: "Declared equals realized.",
  });
}
