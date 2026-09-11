import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("frontend design contract", () => {
  test("loads Funnel fonts and exposes semantic workspace tokens", () => {
    const layout = read("app/layout.tsx");
    const css = read("app/globals.css");

    expect(layout).toContain("Funnel_Display");
    expect(layout).toContain("Funnel_Sans");
    for (const token of ["--font-display", "--font-sans", "--canvas", "--surface", "--ink", "--line", "--accent"]) {
      expect(css).toContain(token);
    }
    expect(css).not.toContain("linear-gradient(");
  });
});
