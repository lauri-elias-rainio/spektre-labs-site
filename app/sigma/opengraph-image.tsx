import lab from "@/data/lab.json";
import { createOgImage } from "@/lib/og";

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: `${lab.name} · Live`,
    title: "Σ-COLLAPSE",
    description:
      "Noise collapses into the mark. σ measured live on your GPU.",
    footer: "1 = 1 · Declared = Realized",
  });
}
