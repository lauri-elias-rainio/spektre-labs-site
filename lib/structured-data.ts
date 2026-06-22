import type { Artifact } from "@/lib/artifacts";
import lab from "@/data/lab.json";
import { absoluteUrl } from "@/lib/site";

const personId = absoluteUrl("/about#person");
const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");

export function getGlobalStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ResearchOrganization",
        "@id": organizationId,
        name: lab.name,
        url: absoluteUrl("/"),
        description: lab.subtext,
        location: {
          "@type": "Place",
          name: lab.location,
        },
        founder: {
          "@id": personId,
          "@type": "Person",
          name: lab.author,
        },
        sameAs: [lab.github, lab.linkedin, `https://orcid.org/${lab.orcid}`],
      },
      {
        "@type": "Person",
        "@id": personId,
        name: lab.author,
        jobTitle: lab.about.authorSection.role,
        description: lab.about.authorSection.bio,
        url: absoluteUrl("/about"),
        worksFor: {
          "@id": organizationId,
        },
        sameAs: [lab.linkedin, lab.github, `https://orcid.org/${lab.orcid}`],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: lab.name,
        url: absoluteUrl("/"),
        description: lab.subtext,
        publisher: {
          "@id": organizationId,
        },
        inLanguage: "en",
      },
    ],
  };
}

export function getArtifactsPageStructuredData(artifacts: Artifact[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/artifacts#collection"),
    url: absoluteUrl("/artifacts"),
    name: "Artifacts",
    description: "Research artifacts published by Spektre Labs.",
    isPartOf: {
      "@id": websiteId,
    },
    publisher: {
      "@id": organizationId,
    },
    about: "Research artifacts",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: artifacts.map((artifact, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/artifacts/${artifact.slug}`),
        name: artifact.title,
      })),
    },
  };
}

export function getResearchPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/research#page"),
        url: absoluteUrl("/research"),
        name: "Research",
        description:
          "Research organized as interconnected layers across which coherence, stability, and collapse can be studied.",
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lab.name,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Research",
            item: absoluteUrl("/research"),
          },
        ],
      },
    ],
  };
}

export function getMethodPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/method#page"),
        url: absoluteUrl("/method"),
        name: lab.method.title,
        description: lab.method.description,
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lab.name,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Method",
            item: absoluteUrl("/method"),
          },
        ],
      },
    ],
  };
}

export function getArtifactStructuredData(artifact: Artifact) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/artifacts/${artifact.slug}#work`),
    name: artifact.title,
    headline: artifact.title,
    description: artifact.summary,
    url: absoluteUrl(`/artifacts/${artifact.slug}`),
    inLanguage: "en",
    creator: {
      "@id": personId,
    },
    author: {
      "@id": personId,
    },
    publisher: {
      "@id": organizationId,
    },
    isPartOf: {
      "@id": absoluteUrl("/artifacts#collection"),
    },
    mainEntityOfPage: absoluteUrl(`/artifacts/${artifact.slug}`),
    sameAs: [artifact.github, artifact.zenodo].filter(Boolean),
  };
}
