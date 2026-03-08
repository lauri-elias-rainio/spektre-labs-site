import { getArtifactBySlug } from "@/lib/artifacts";
import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const artifact = getArtifactBySlug(slug);

  return createOgImage({
    eyebrow: "Artifact",
    title: artifact?.title ?? "Artifact",
    description: artifact?.summary ?? "",
    footer: "Spektre Labs",
  });
}

