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
        sameAs: [lab.github, lab.linkedin, lab.youtube, `https://orcid.org/${lab.orcid}`],
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
        sameAs: [lab.linkedin, lab.github, lab.youtube, `https://orcid.org/${lab.orcid}`],
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
