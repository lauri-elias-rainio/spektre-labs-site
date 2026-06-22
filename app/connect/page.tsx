import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { createPageMetadata } from "@/lib/site";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = createPageMetadata({
  title: "Connect",
  description:
    "Collaborate, cite, or build on Spektre Labs research. Direct contact, GitHub, LinkedIn, YouTube, ORCID, Zenodo.",
  path: "/connect",
});

/*
  Connect page — premium contact / collaborate surface.
  σ-honest: real links only. No fake form backend — mailto on email.
  Layout: symmetric, Glyph, Reveal. Mono-Abloh voice. Terse.
*/

const CHANNELS = [
  {
    id: "01",
    label: "Email",
    name: "spektre.labs@proton.me",
    href: LINKS.email,
    note: "Primary channel for collaboration & citation inquiries.",
    action: "Write",
    external: false,
  },
  {
    id: "02",
    label: "GitHub",
    name: "spektre-labs",
    href: LINKS.github,
    note: "Source code, open tooling, and the σ-gate implementation.",
    action: "Explore",
    external: true,
  },
  {
    id: "03",
    label: "LinkedIn",
    name: "Lauri Elias Rainio",
    href: LINKS.linkedin,
    note: "Professional network and research announcements.",
    action: "Connect",
    external: true,
  },
  {
    id: "04",
    label: "YouTube",
    name: "@spektrelabs",
    href: LINKS.youtube,
    note: "Studio division — dark-luxury generative media, live.",
    action: "Watch",
    external: true,
  },
  {
    id: "05",
    label: "ORCID",
    name: `0009-0006-0903-8541`,
    href: LINKS.orcid,
    note: "Persistent researcher identifier for citation and indexing.",
    action: "Cite",
    external: true,
  },
  {
    id: "06",
    label: "Zenodo",
    name: "Spektre Labs · Zenodo",
    href: LINKS.zenodo,
    note: "Archived research outputs and open datasets.",
    action: "Archive",
    external: true,
  },
] as const;

export default function ConnectPage() {
  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────── */}
      <PageHeader
        title="Connect"
        description="Collaborate, cite, or build on the work. All channels are direct."
      />

      {/* ── Invitation line — single editorial statement ─────────────── */}
      <Reveal delay={80} className="mt-14 sm:mt-16">
        <div className="max-w-[44rem]">
          <p
            className="text-pretty leading-[1.84] sm:text-[1.08rem]"
            style={{ color: "var(--fg-dim)" }}
          >
            If you are extending the research, building on the tooling, or want to
            cite the corpus — reach out directly. No intermediaries.
          </p>
        </div>
      </Reveal>

      {/* ── Divider Glyph — symmetric ────────────────────────────────── */}
      <Reveal delay={160} className="mt-16 flex justify-center">
        <Glyph variant="divider" size={260} strokeOpacity={0.32} />
      </Reveal>

      {/* ── Channel grid ─────────────────────────────────────────────── */}
      <Section
        title="Channels"
        eyebrow="Contact · Real Links"
        className="mt-24 pt-12 sm:mt-32 sm:pt-16 lg:mt-36 lg:pt-20"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-[54rem]">
          {CHANNELS.map((ch, i) => (
            <Reveal key={ch.id} delay={i * 60}>
              <a
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="surface surface-hover group flex flex-col rounded-[var(--radius)] p-6 sm:p-7 no-underline h-full"
              >
                {/* top: id + label */}
                <div className="flex items-center justify-between mb-4">
                  <p className="label" style={{ color: "var(--fg-faint)" }}>
                    {ch.id} — {ch.label}
                  </p>
                  <span
                    className="label text-[0.58rem] tracking-[0.22em]"
                    style={{ color: "var(--signal)" }}
                  >
                    {ch.action} →
                  </span>
                </div>

                {/* channel name */}
                <p
                  className="text-[1rem] font-semibold tracking-[-0.018em] leading-[1.25] mb-3"
                  style={{ color: "var(--fg)" }}
                >
                  {ch.name}
                </p>

                {/* note */}
                <p
                  className="text-[0.84rem] leading-[1.84] mt-auto pt-3"
                  style={{ color: "var(--fg-mute)" }}
                >
                  {ch.note}
                </p>

                {/* bottom hairline */}
                <div
                  className="mt-5 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--line-strong), transparent)",
                  }}
                />
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Metadata rail — Abloh mono labels ───────────────────────── */}
      <Reveal delay={0} className="mt-24 sm:mt-32">
        <div className="max-w-[54rem] grid grid-cols-2 gap-0 sm:grid-cols-4 border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
          {[
            { label: "Location", value: "Helsinki" },
            { label: "Channels", value: "06" },
            { label: "Response", value: "Direct" },
            { label: "Standard", value: "σ = 1 = 1" },
          ].map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 55}
              className="border-r border-[var(--line)] last:border-r-0 px-5 py-4"
            >
              <p className="label text-[var(--fg-faint)] mb-1.5">{item.label}</p>
              <p
                className="text-[0.92rem] tracking-[-0.01em]"
                style={{ color: "var(--fg-dim)" }}
              >
                {item.value}
              </p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ── Final seal — absolute bilateral/radial symmetry ─────────── */}
      <Reveal delay={0} className="mt-40 mb-20 flex flex-col items-center gap-8 lg:mt-52">
        <Glyph variant="seal" size={140} strokeOpacity={0.30} />
        <div className="text-center">
          <p className="label mb-2" style={{ color: "var(--fg-faint)" }}>
            Spektre Labs · Connect
          </p>
          <p
            className="label text-[0.6rem] tracking-[0.26em]"
            style={{ color: "var(--fg-faint)", opacity: 0.6 }}
          >
            Research → Systems → Studio → Games → Shoreworld
          </p>
        </div>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
