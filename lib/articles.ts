import articles from "@/data/articles.json";

import lab from "@/data/lab.json";
import { absoluteUrl } from "@/lib/site";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type ArticleReference = {
  label: string;
  href: string;
  note: string;
};

export type Article = {
  slug: string;
  eyebrow: string;
  title: string;
  date: string;
  readingTime: number;
  sigmaStatus: string;
  summary: string;
  body: BodyBlock[];
  references?: ArticleReference[];
};

/* ── Accessors ──────────────────────────────────────────────────────────────── */

export function getArticles(): Article[] {
  return articles as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

/* ── Structured data ────────────────────────────────────────────────────────── */

const personId = absoluteUrl("/about#person");
const organizationId = absoluteUrl("/#organization");

export function getArticleStructuredData(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/research/${article.slug}#article`),
    headline: article.title,
    description: article.summary,
    url: absoluteUrl(`/research/${article.slug}`),
    datePublished: article.date,
    inLanguage: "en",
    author: {
      "@id": personId,
      "@type": "Person",
      name: lab.author,
    },
    publisher: {
      "@id": organizationId,
      "@type": "Organization",
      name: lab.name,
    },
    isPartOf: {
      "@type": "WebPage",
      url: absoluteUrl("/research"),
    },
  };
}
