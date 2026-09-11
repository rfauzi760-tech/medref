import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const vendor = new URL("vendor/klinea/", root);
const manifest = JSON.parse(readFileSync(new URL("source.json", vendor), "utf8"));
const sandbox = { window: {}, console };

vm.createContext(sandbox);

for (const [file, metadata] of Object.entries(manifest.files)) {
  const source = readFileSync(new URL(file, vendor), "utf8");
  const checksum = createHash("sha256").update(source).digest("hex");
  if (checksum !== metadata.sha256) throw new Error(`Checksum mismatch for ${file}`);
  vm.runInContext(source, sandbox, { filename: file, timeout: 10_000 });
}

const K = sandbox.window.KL;
if (!K) throw new Error("Klinea bundles did not expose window.KL");

const normalize = (value) => {
  if (typeof value === "string") return value.replace(/\s*—\s*/g, " - ").trim();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item !== "function").map(([key, item]) => [key, normalize(item)]));
  }
  return value;
};

const output = normalize({
  source: manifest,
  tools: K.TOOLS.map((tool) => tool.meta),
  toolExtra: K.TOOL_EXTRA,
  drugs: K.DRUGS,
  drugGroups: K.DRUG_GROUPS,
  interactions: K.DRUG_IX,
  guidelines: K.GUIDELINES,
  guidelineExtra: K.GN_EXTRA,
  icd10: K.ICD10,
  foods: K.FOODS,
  nutrition: K.NUTRI,
  milestones: K.MILESTONES,
  lms: K.LMS,
  cdc: K.CDC,
});

writeFileSync(new URL("lib/generated/klinea-content.json", root), `${JSON.stringify(output)}\n`);
console.log(`Generated canonical Klinea content from ${Object.keys(manifest.files).length} verified bundles.`);
