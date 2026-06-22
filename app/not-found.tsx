import Link from "next/link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";

export default function NotFound() {
  return (
    <main
      className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 text-center"
      aria-labelledby="not-found-heading"
    >
      <Reveal delay={0}>
        <Glyph variant="seal" size={88} strokeOpacity={0.35} />
      </Reveal>

      <Reveal delay={120}>
        <p className="label" style={{ color: "var(--signal)", letterSpacing: "0.3em" }}>
          σ — declared ≠ realized
        </p>
      </Reveal>

      <Reveal delay={200}>
        <h1
          id="not-found-heading"
          className="metal-text"
          style={{ fontSize: "clamp(3rem,10vw,6rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          404
        </h1>
      </Reveal>

      <Reveal delay={280}>
        <p style={{ color: "var(--fg-mute)", fontSize: "0.9rem", letterSpacing: "0.02em" }}>
          this page does not exist
        </p>
      </Reveal>

      <Reveal delay={380}>
        <Link
          href="/"
          className="btn-metal"
          style={{
            display: "inline-block",
            padding: "0.6rem 2rem",
            borderRadius: "var(--radius)",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Return Home
        </Link>
      </Reveal>
    </main>
  );
}
