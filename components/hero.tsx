import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

export function Hero() {
  return (
    <section className="border-b border-neutral-200/80 pb-20 pt-4 dark:border-neutral-800/80 sm:pb-24 sm:pt-8 lg:pb-32 lg:pt-12">
      <div className="max-w-[58rem]">
        <h1 className="max-w-[44rem] text-balance text-[2.85rem] font-semibold tracking-tight sm:text-[3.78rem] md:text-[4.55rem] md:leading-[0.965] lg:text-[5.28rem]">
          {lab.name}
        </h1>
        <p className="mt-9 max-w-[31rem] text-pretty text-[1.24rem] font-medium leading-[1.28] text-neutral-800 dark:text-neutral-200 sm:text-[1.6rem] lg:mt-12 lg:text-[1.76rem]">
          {lab.home.hero.tagline}
        </p>
        <div className="mt-10 max-w-[37rem] space-y-5 text-[0.98rem] leading-[1.95] text-neutral-600 dark:text-neutral-400 sm:text-[1.04rem] lg:mt-12">
          {lab.home.hero.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 lg:mt-16">
          <Link href="/artifacts" className={buttonClassName({ size: "sm" })}>
            View Artifacts
          </Link>
          <Link
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName({ variant: "outline", size: "sm" })}
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

