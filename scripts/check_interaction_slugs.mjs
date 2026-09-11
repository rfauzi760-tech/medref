import { readFileSync } from "node:fs";

const drugsSrc = readFileSync("lib/data/drugs.ts", "utf8");
const interSrc = readFileSync("lib/data/interactions.ts", "utf8");
const drugSlugs = new Set([...drugsSrc.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]));
const interRefs = new Set(
  [...interSrc.matchAll(/I\("([a-z0-9-]+)", "([a-z0-9-]+)"/g)].flatMap((m) => [m[1], m[2]]),
);
const missing = [...interRefs].filter((s) => !drugSlugs.has(s));
console.log("drugs:", drugSlugs.size, "| interaction refs:", interRefs.size);
console.log("missing from drugs:", missing.length ? missing : "none");
process.exit(missing.length ? 1 : 0);