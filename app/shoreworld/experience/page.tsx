import type { Metadata } from "next";

import ShoreworldExperience from "@/components/shoreworld-experience";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "The Coherence Capital — Live",
  description:
    "A real-time procedural reality engine: the Shoreworld capital generated live on your GPU with perfect symmetry. WebGPU, no lag, the world is the math.",
  path: "/shoreworld/experience",
  image: "/generated/shoreworld/city.png",
});

/*
  /shoreworld/experience — the live procedural-reality engine.
  Server component: ships metadata + renders the client experience shell.
  The engine is SSR-safe (all WebGPU/Three imports happen inside a client
  effect), so no dynamic import is needed.
*/

export default function ShoreworldExperiencePage() {
  return (
    <>
      {/* SEO / a11y anchor — the visual surface is the fixed canvas */}
      <h1 className="sr-only">
        Shoreworld — The Coherence Capital · live procedural reality engine
      </h1>
      <ShoreworldExperience />
    </>
  );
}
