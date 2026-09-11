import "server-only";
import { RADIOLOGY_ATLAS_PACKED_1 } from "@/lib/data/radiology-atlas-1";
import { RADIOLOGY_ATLAS_PACKED_2 } from "@/lib/data/radiology-atlas-2";
import { RADIOLOGY_ATLAS_PACKED_3 } from "@/lib/data/radiology-atlas-3";
import { RADIOLOGY_ATLAS_PACKED_4 } from "@/lib/data/radiology-atlas-4";

export interface RadiologyAtlasEntry {
  title: string;
  category: string;
  tag: string;
  detail: string;
}

function unpack(value: string): RadiologyAtlasEntry[] {
  return value.split("\u001f").map((row) => {
    const [title, category, tag, detail] = row.split("\u001e");
    return { title, category, tag, detail };
  });
}

export const RADIOLOGY_ATLAS_ENTRIES: readonly RadiologyAtlasEntry[] = [
  ...unpack(RADIOLOGY_ATLAS_PACKED_1),
  ...unpack(RADIOLOGY_ATLAS_PACKED_2),
  ...unpack(RADIOLOGY_ATLAS_PACKED_3),
  ...unpack(RADIOLOGY_ATLAS_PACKED_4),
];
