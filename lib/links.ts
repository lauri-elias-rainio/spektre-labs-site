import lab from "@/data/lab.json";

export const LINKS = {
  github: lab.github,
  zenodo: lab.zenodo,
  orcid: `https://orcid.org/${lab.orcid}`,
  email: `mailto:${lab.email}`,
  linkedin: lab.linkedin,
} as const;


