import research from "@/data/research.json";

export type ResearchItem = {
  title: string;
  description?: string;
};

export type ResearchLayer = {
  description?: string;
  layer: string;
  introduction?: string[];
  note?: string;
  items: ResearchItem[];
};

export function getResearchLayers(): ResearchLayer[] {
  return (research as ResearchLayer[]).filter((entry) => entry.layer);
}

export function getResearchItemCount(layers: ResearchLayer[] = getResearchLayers()) {
  return layers.reduce((total, layer) => total + layer.items.length, 0);
}

export function getResearchIntroduction(): string[] {
  const intro = (research as ResearchLayer[]).find((entry) => entry.introduction);
  return intro?.introduction ?? [];
}

