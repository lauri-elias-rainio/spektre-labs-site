import { getArtifacts } from "@/lib/artifacts";
import lab from "@/data/lab.json";
import { absoluteUrl } from "@/lib/site";

export function GET() {
  const artifacts = getArtifacts();

  const body = [
    `# ${lab.name}`,
    "",
    `> ${lab.subtext}`,
    "",
    "## Canonical URLs",
    `- Home: ${absoluteUrl("/")}`,
    `- Artifacts: ${absoluteUrl("/artifacts")}`,
    `- Research: ${absoluteUrl("/research")}`,
    `- Method: ${absoluteUrl("/method")}`,
    `- About: ${absoluteUrl("/about")}`,
    "",
    "## Primary Artifact",
    ...artifacts.map((artifact) => `- ${artifact.title}: ${absoluteUrl(`/artifacts/${artifact.slug}`)}`),
    "",
    "## External References",
    `- GitHub: ${lab.github}`,
    `- ORCID: https://orcid.org/${lab.orcid}`,
    `- LinkedIn: ${lab.linkedin}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
