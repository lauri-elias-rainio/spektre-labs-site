import artifacts from "@/data/artifacts.json";

export type Artifact = {
  slug: string;
  title: string;
  summary: string;
  homeDescription?: string[];
  description: string[];
  github?: string;
  zenodo?: string;
  prominence?: "primary" | "secondary";
};

type ArtifactData = {
  introduction: string[];
  items: Artifact[];
};

export function getArtifacts(): Artifact[] {
  return (artifacts as ArtifactData).items;
}

export function getArtifactsIntroduction(): string[] {
  return (artifacts as ArtifactData).introduction;
}

export function getArtifactBySlug(slug: string): Artifact | undefined {
  return getArtifacts().find((a) => a.slug === slug);
}

