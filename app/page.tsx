import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { ProductSection } from "@/components/sections/product";
import { ParadigmSection } from "@/components/sections/paradigm";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { getArtifacts } from "@/lib/artifacts";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: lab.name,
  description: lab.subtext,
  path: "/",
});

/**
 * One spine, one system (STYLE_LAW §8):
 * Hero (Σ-COLLAPSE) → Product → Paradigm → Capabilities → Index.
 * The footer is rendered once, by the layout. Nothing after it.
 */
export default function Home() {
  const artifacts = getArtifacts();
  const corpus = artifacts.find((a) => a.slug === "spektre-corpus");
  const protocol = artifacts.find((a) => a.slug === "spektre-protocol");

  const index = [
    corpus && {
      label: "Primary artifact",
      title: corpus.title,
      summary: corpus.summary,
      href: "/artifacts/spektre-corpus",
    },
    protocol && {
      label: "Framework",
      title: protocol.title,
      summary: protocol.summary,
      href: "/artifacts/spektre-protocol",
    },
    {
      label: "Programme",
      title: lab.home.research.title,
      summary: lab.home.research.description,
      href: "/research",
    },
    {
      label: "Practice",
      title: lab.home.method.title,
      summary: lab.home.method.description,
      href: "/method",
    },
  ].filter(Boolean) as Array<{
    label: string;
    title: string;
    summary: string;
    href: string;
  }>;

  return (
    <div>
      <Hero />
      <ProductSection />
      <ParadigmSection />
      <CapabilitiesSection />

      {/* ── Index — the editorial rail into the rest of the site ── */}
      <section className="spektre-stage relative -mx-6 border-b border-white/10 px-6 py-20 sm:-mx-10 sm:px-10 sm:py-24 lg:-mx-14 lg:px-14 lg:py-28">
        <Reveal className="relative mx-auto max-w-5xl">
          <p className="spektre-label" style={{ color: "#cfe3ff" }}>
            “Index” · 04
          </p>
          <div className="mt-10 flex flex-col">
            {index.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group grid gap-2 border-t border-white/10 py-7 transition-colors sm:grid-cols-12 sm:gap-6"
              >
                <p className="spektre-label sm:col-span-3" style={{ color: "#4a4f58" }}>
                  {item.label}
                </p>
                <h3 className="text-[1.24rem] leading-snug tracking-[-0.01em] text-[#dadee5] transition-colors group-hover:text-white sm:col-span-4">
                  {item.title}
                </h3>
                <p className="text-[0.92rem] leading-[1.8] text-[#888d97] sm:col-span-5">
                  {item.summary}
                </p>
              </Link>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
