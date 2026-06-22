import { getArtifactBySlug } from "@/lib/artifacts";
import { createOgImage, ogContentType as contentType, ogImageSize as size } from "@/lib/og";

export { contentType, size };

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);

  return createOgImage({
    eyebrow: "Artifact",
    title: artifact?.title ?? "Artifact",
    description: artifact?.summary ?? "",
    footer: "Spektre Labs",
  });
}

