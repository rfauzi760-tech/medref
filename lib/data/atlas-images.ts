import "server-only";

import ecgManifest from "@/lib/data/atlas-images-ecg.json";
import radiologyManifest from "@/lib/data/atlas-images-radiology.json";

export type AtlasMode = "ecg" | "radiology";

export interface AtlasImage {
  src: string;
  caption: string;
}

interface SourceImage {
  src: string;
  caption: string;
}

interface SourceEntry {
  images: SourceImage[];
}

const manifests: Record<AtlasMode, SourceEntry[]> = {
  ecg: ecgManifest,
  radiology: radiologyManifest,
};

export function getAtlasImages(mode: AtlasMode, entryIndex: number): AtlasImage[] {
  const images = manifests[mode][entryIndex]?.images ?? [];
  return images.map((image, imageIndex) => ({
    src: `/api/atlas-image/${mode}/${entryIndex}/${imageIndex}`,
    caption: image.caption,
  }));
}

export function getAtlasSourceImage(mode: AtlasMode, entryIndex: number, imageIndex: number): SourceImage | undefined {
  return manifests[mode][entryIndex]?.images?.[imageIndex];
}

export function getAtlasImageStats(mode: AtlasMode) {
  const entries = manifests[mode];
  return {
    entries: entries.length,
    images: entries.reduce((total, entry) => total + entry.images.length, 0),
    emptyEntries: entries.filter((entry) => entry.images.length === 0).length,
  };
}
