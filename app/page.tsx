import type { Metadata } from "next";

import { EditorialLink } from "@/components/editorial-link";
import { Hero } from "@/components/hero";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { getArtifacts } from "@/lib/artifacts";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: lab.name,
  description: lab.subtext,
  path: "/",
});

export default function Home() {
  const artifacts = getArtifacts();
  const corpus = artifacts.find((artifact) => artifact.slug === "spektre-corpus");
  const protocol = artifacts.find((artifact) => artifact.slug === "spektre-protocol");

  return (
    <div>
      <Hero />

      <Section title={lab.home.whatWeDo.title} className="mt-20 pt-10 sm:mt-24 sm:pt-12 lg:mt-28 lg:pt-16">
        <div className="max-w-[45rem]">
          <ProseBlock size="lead">
            <p>{lab.home.whatWeDo.description}</p>
            <p>{lab.home.whatWeDo.detail}</p>
          </ProseBlock>
          <ul className="mt-9 grid gap-x-12 gap-y-3.5 text-neutral-700 dark:text-neutral-300 sm:grid-cols-2">
            {lab.home.whatWeDo.domains.map((domain) => (
              <li
                key={domain}
                className="border-b border-neutral-200/80 pb-3 text-[0.98rem] dark:border-neutral-800/80"
              >
                {domain}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Primary Artifact" className="mt-28 pt-14 sm:mt-32 sm:pt-16 lg:mt-40 lg:pt-20">
        {corpus ? (
          <div className="max-w-[48rem] border-t border-neutral-200/80 pt-9 dark:border-neutral-800/80 lg:pl-6">
            <h3 className="max-w-[40rem] text-balance text-[2.2rem] font-semibold tracking-tight sm:text-[2.7rem] lg:text-[3.35rem] lg:leading-[1.02]">
              {corpus.title}
            </h3>
            <p className="mt-5 max-w-[43rem] text-pretty text-[1.08rem] leading-[1.72] text-neutral-700 dark:text-neutral-300 sm:text-[1.22rem]">
              {corpus.summary}
            </p>
            <div className="mt-9 max-w-[39rem] space-y-5">
              {(corpus.homeDescription ?? corpus.description.slice(0, 2)).map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-[1.9] text-neutral-600 dark:text-neutral-400 sm:text-[1.02rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-10 space-y-4">
              {corpus.github ? (
                <div>
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                    Repository
                  </p>
                  <div className="mt-2">
                    <EditorialLink href={corpus.github} external>
                      {corpus.github}
                    </EditorialLink>
                  </div>
                </div>
              ) : null}
              <EditorialLink href="/artifacts/spektre-corpus" className="inline-block">
                View Artifact
              </EditorialLink>
            </div>
          </div>
        ) : null}
      </Section>

      <Section title="Supporting Framework" className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        {protocol ? (
          <div className="max-w-[38rem] border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
            <h3 className="text-2xl font-semibold tracking-tight">
              {protocol.title}
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-[1.85] text-neutral-600 dark:text-neutral-400">
              {protocol.summary}
            </p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {(protocol.homeDescription ?? protocol.description.slice(0, 1)).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {protocol.github ? (
              <div className="mt-6">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                  Repository
                </p>
                <div className="mt-2">
                  <EditorialLink href={protocol.github} external>
                    {protocol.github}
                  </EditorialLink>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>

      <Section title={lab.home.research.title} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[40rem] border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
          <ProseBlock>
            <p>{lab.home.research.description}</p>
            <p>{lab.home.research.detail}</p>
          </ProseBlock>
          <div className="mt-6">
            <EditorialLink href="/research">View Research</EditorialLink>
          </div>
        </div>
      </Section>

      <Section title={lab.home.method.title} className="mt-24 pt-12 sm:mt-28 sm:pt-14 lg:mt-32 lg:pt-14">
        <div className="max-w-[40rem] border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
          <ProseBlock>
            <p>{lab.home.method.description}</p>
          </ProseBlock>
          <div className="mt-6">
            <EditorialLink href="/method">View Method</EditorialLink>
          </div>
        </div>
      </Section>
    </div>
  );
}
