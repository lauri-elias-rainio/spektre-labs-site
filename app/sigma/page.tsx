import type { Metadata } from "next";

import SigmaExperience from "@/components/sigma/experience";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Σ-COLLAPSE — Live",
  description:
    "The Spektre law rendered as physics: a raw-WebGPU compute field where noise collapses into the sigil and σ — the distance between declared and realized — is measured live on your GPU.",
  path: "/sigma",
});

/*
  /sigma — the Σ-COLLAPSE experience.
  Server component ships metadata; the engine is SSR-safe (WebGPU only
  touched inside a client effect).
*/

export default function SigmaPage() {
  return (
    <>
      <h1 className="sr-only">
        Σ-COLLAPSE — live compute field · σ measured in real time
      </h1>
      <SigmaExperience />
    </>
  );
}
