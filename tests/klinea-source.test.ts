import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const artifactUrl = new URL("../lib/generated/klinea-content.json", import.meta.url);

describe("canonical Klinea content snapshot", () => {
  test("contains every public clinical catalog", () => {
    expect(existsSync(artifactUrl)).toBe(true);
    const data = JSON.parse(readFileSync(artifactUrl, "utf8"));

    expect(data.tools).toHaveLength(163);
    expect(data.drugs).toHaveLength(517);
    expect(data.interactions).toHaveLength(152);
    expect(data.guidelines).toHaveLength(340);
    expect(Object.keys(data.guidelineExtra)).toHaveLength(340);
    expect(data.icd10).toHaveLength(638);
    expect(data.foods).toHaveLength(478);
    expect(data.nutrition).toHaveLength(16);
    expect(data.milestones).toHaveLength(16);
  });

  test("normalizes em dashes out of visible canonical strings", () => {
    expect(existsSync(artifactUrl)).toBe(true);
    const content = readFileSync(artifactUrl, "utf8");
    expect(content).not.toContain("—");
  });
});
