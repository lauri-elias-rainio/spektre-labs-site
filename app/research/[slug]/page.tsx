import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/back-link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { StructuredData } from "@/components/structured-data";
import {
  getArticleBySlug,
  getArticleStructuredData,
  getArticles,
  type BodyBlock,
} from "@/lib/articles";
import { createPageMetadata } from "@/lib/site";

/* ── Static params — one route per article ─────────────────────────────────── */

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

/* ── Metadata ───────────────────────────────────────────────────────────────── */

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Field Note" };
  return createPageMetadata({
    title: article.title,
    description: article.summary,
    path: `/research/${slug}`,
    type: "article",
  });
}

/* ── Body block renderer ────────────────────────────────────────────────────── */

function BodyBlocks({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <Reveal key={`p-${i}`} delay={Math.min(i * 28, 320)}>
              <p className="max-w-[65ch] text-[1rem] leading-[1.90] text-[var(--fg-mute)]">
                {block.text}
              </p>
            </Reveal>
          );
        }

        if (block.type === "h2") {
          return (
            <Reveal key={`h2-${i}`} delay={Math.min(i * 28, 320)}>
              <h2
                className="mt-10 mb-1 max-w-[52ch] font-semibold leading-[1.22] tracking-[-0.025em]"
                style={{ color: "var(--fg)", fontSize: "1.08rem" }}
              >
                {block.text}
              </h2>
            </Reveal>
          );
        }

        if (block.type === "ul") {
          return (
            <Reveal key={`ul-${i}`} delay={Math.min(i * 28, 320)}>
              <ul className="max-w-[65ch] space-y-3">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.97rem] leading-[1.84] text-[var(--fg-mute)]"
                  >
                    {/* platinum bullet */}
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--metal-4)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        }

        return null;
      })}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getArticles();
  const related = allArticles.filter((a) => a.slug !== article.slug);

  return (
    <div>
      {/* Article JSON-LD */}
      <StructuredData data={getArticleStructuredData(article)} />

      {/* Back navigation */}
      <BackLink href="/research" className="mb-12">
        Back to Research
      </BackLink>

      {/* ── Article header ── */}
      <header className="border-b pb-12" style={{ borderColor: "var(--line)" }}>
        <Reveal>
          <p className="label mb-5" style={{ color: "var(--fg-faint)" }}>
            {article.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1
            className="metal-text max-w-[22ch] font-semibold leading-[1.08] tracking-[-0.035em]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            {article.title}
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p
            className="mt-6 max-w-[52ch] text-[1.02rem] leading-[1.84]"
            style={{ color: "var(--fg-dim)" }}
          >
            {article.summary}
          </p>
        </Reveal>

        {/* Mono metadata strip — date · read time · σ-status */}
        <Reveal delay={170}>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <span className="label" style={{ color: "var(--fg-faint)" }}>
              {article.date}
            </span>

            <span
              aria-hidden
              className="h-px w-4"
              style={{ background: "var(--line-strong)" }}
            />

            <span className="label" style={{ color: "var(--fg-faint)" }}>
              {article.readingTime}&nbsp;min&nbsp;read
            </span>

            <span
              aria-hidden
              className="h-px w-4"
              style={{ background: "var(--line-strong)" }}
            />

            {/* σ-status — the gap between declared and realized */}
            <span
              className="label"
              style={{ color: "var(--signal)", opacity: 0.8 }}
            >
              σ&nbsp;—&nbsp;{article.sigmaStatus.toUpperCase()}
            </span>
          </div>
        </Reveal>
      </header>

      {/* ── Article body — 65ch editorial column ── */}
      <article className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* left gutter */}
        <div className="hidden lg:col-span-3 lg:block" />

        <div className="lg:col-span-9">
          <BodyBlocks blocks={article.body} />

          {/* References */}
          {article.references && article.references.length > 0 && (
            <Reveal delay={0} className="mt-16">
              <div
                className="border-t pt-8"
                style={{ borderColor: "var(--line)" }}
              >
                <p
                  className="label mb-5"
                  style={{ color: "var(--fg-faint)" }}
                >
                  References
                </p>

                <div className="space-y-4">
                  {article.references.map((ref) => (
                    <div
                      key={ref.href}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
                    >
                      <Link
                        href={ref.href}
                        target={ref.href.startsWith("http") ? "_blank" : undefined}
                        rel={ref.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="label transition-colors duration-300"
                        style={{ color: "var(--fg-dim)" }}
                      >
                        {ref.label}&nbsp;→
                      </Link>
                      <span
                        className="text-[0.8rem] leading-[1.6]"
                        style={{ color: "var(--fg-faint)" }}
                      >
                        {ref.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {/* ── Related field notes ── */}
      {related.length > 0 && (
        <section
          className="mt-24 border-t pt-14 sm:mt-32 sm:pt-18"
          style={{ borderColor: "var(--line)" }}
        >
          <Reveal delay={0}>
            <div className="mb-10 flex items-center gap-5">
              <Glyph variant="divider" size={100} strokeOpacity={0.25} />
              <p className="label shrink-0" style={{ color: "var(--fg-faint)" }}>
                More field notes
              </p>
              <Glyph variant="divider" size={100} strokeOpacity={0.25} />
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((rel, i) => (
              <Reveal key={rel.slug} delay={60 + i * 80}>
                <article className="group surface surface-hover flex h-full flex-col p-7 sm:p-8">
                  <p
                    className="label mb-4"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    {rel.eyebrow}
                  </p>

                  <h3
                    className="flex-1 text-[1.02rem] font-semibold leading-[1.24] tracking-[-0.022em]"
                    style={{ color: "var(--fg)" }}
                  >
                    <Link
                      href={`/research/${rel.slug}`}
                      className="transition-colors duration-500 hover:text-[var(--metal-1)]"
                    >
                      {rel.title}
                    </Link>
                  </h3>

                  <p
                    className="mt-3.5 text-[0.84rem] leading-[1.82]"
                    style={{ color: "var(--fg-mute)" }}
                  >
                    {rel.summary}
                  </p>

                  <div
                    className="mt-6 flex items-center justify-between border-t pt-5"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <Link
                      href={`/research/${rel.slug}`}
                      className="label transition-colors duration-500 hover:text-[var(--fg)]"
                      style={{ color: "var(--fg-dim)" }}
                    >
                      Read&nbsp;→
                    </Link>
                    <span
                      className="label"
                      style={{ color: "var(--fg-faint)" }}
                    >
                      {rel.readingTime}&nbsp;min
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Closing glyph — symmetric seal on void */}
      <Reveal delay={0}>
        <div className="flex justify-center py-20 sm:py-28">
          <Glyph variant="seal" size={52} strokeOpacity={0.12} />
        </div>
      </Reveal>
    </div>
  );
}
