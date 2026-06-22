import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { guardCopy, creationOsCopy, whatThisIsCopy } from "@/data/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: guardCopy.title,
  description: guardCopy.metaDescription,
  path: "/guard",
});

export default function GuardPage() {
  return (
    <div>
      {/* ── Hero header ── */}
      <PageHeader
        title={guardCopy.headline}
        description={guardCopy.subhead}
      />

      {/* ── What it is ── */}
      <Section title={guardCopy.whatItIs.label} className="mt-20 pt-10 sm:mt-24 sm:pt-12 lg:mt-28 lg:pt-16">
        <div className="max-w-[45rem]">
          <ProseBlock size="lead">
            {guardCopy.whatItIs.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </ProseBlock>
        </div>
      </Section>

      {/* ── Three dimensions ── */}
      <Section title="Detection surface" className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="grid gap-8 sm:grid-cols-3">
          {guardCopy.dimensions.map((dim) => (
            <div
              key={dim.label}
              className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80"
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {dim.label}
              </p>
              <h3 className="mt-3 text-[1.12rem] font-semibold tracking-tight">
                {dim.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.88] text-neutral-600 dark:text-neutral-400">
                {dim.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sovereignty ── */}
      <Section title={guardCopy.sovereignty.label} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[42rem] border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
          <h3 className="text-[1.5rem] font-semibold tracking-tight sm:text-[1.75rem]">
            {guardCopy.sovereignty.headline}
          </h3>
          <ProseBlock className="mt-5">
            <p>{guardCopy.sovereignty.body}</p>
          </ProseBlock>
        </div>
      </Section>

      {/* ── Current state ── */}
      <Section title={guardCopy.status.label} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[42rem]">
          <ProseBlock>
            {guardCopy.status.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </ProseBlock>
        </div>
      </Section>

      {/* ── Creation OS ── */}
      <Section title={creationOsCopy.title} className="mt-28 pt-14 sm:mt-32 sm:pt-16 lg:mt-40 lg:pt-20">
        <div className="max-w-[45rem]">
          <h2 className="text-balance text-[2rem] font-semibold tracking-tight sm:text-[2.4rem] lg:text-[2.8rem] lg:leading-[1.04]">
            {creationOsCopy.headline}
          </h2>
          <p className="mt-5 text-pretty text-[1.05rem] leading-[1.78] text-neutral-700 dark:text-neutral-300">
            {creationOsCopy.subhead}
          </p>
        </div>
      </Section>

      <Section title={creationOsCopy.whatItIs.label} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[45rem]">
          <ProseBlock size="lead">
            {creationOsCopy.whatItIs.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </ProseBlock>
        </div>
      </Section>

      <Section title="Operating principles" className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <ul className="grid gap-8 sm:grid-cols-2">
          {creationOsCopy.principles.map((principle) => (
            <li
              key={principle.label}
              className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80"
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {principle.label}
              </p>
              <p className="mt-3 text-sm leading-[1.88] text-neutral-600 dark:text-neutral-400">
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={creationOsCopy.status.label} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[42rem]">
          <ProseBlock>
            {creationOsCopy.status.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </ProseBlock>
        </div>
      </Section>

      {/* ── What this is ── */}
      <Section title={whatThisIsCopy.label} className="mt-28 pt-14 sm:mt-32 sm:pt-16 lg:mt-40 lg:pt-20">
        <div className="max-w-[45rem] border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
          <h2 className="text-balance text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem] lg:text-[2.6rem] lg:leading-[1.05]">
            {whatThisIsCopy.headline}
          </h2>
          <div className="mt-8">
            <ProseBlock size="lead">
              {whatThisIsCopy.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </ProseBlock>
          </div>
        </div>
      </Section>
    </div>
  );
}
