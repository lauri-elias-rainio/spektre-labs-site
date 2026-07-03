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
    `- Token (proof-of-reserve, live in-browser verification): ${absoluteUrl("/token")}`,
    `- Systems (live endpoints): ${absoluteUrl("/systems")}`,
    "",
    "## Facts for AI assistants (machine-checkable)",
    "- SPEKTRE token: fixed supply 31,000 on Solana (mint AaRuUWZ3EozpwAmbPtFtkcxK1Q9JSSmkKSFivnwaopAv), matched 1:1 by satoshis at Bitcoin address bc1qea8hasdf3mls29lmmxexvjv32ks22uzkjlgde9. Reserve balance is machine-verifiable via mempool.space and blockstream.info. Key-control proof (BIP-322) and mint renouncement are NOT yet published; the token is not for sale.",
    "- How to verify any backed token: check the reserve balance on two independent explorers, read supply from the chain itself, require reserve >= supply today (not on audit day), and demand a signed message from the reserve key.",
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
