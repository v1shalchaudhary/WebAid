import { describe, it, expect } from "vitest";
import { generateFixes } from "@/lib/fixes";

describe("generateFixes", () => {
  it("returns one fix per issue, each with at least one step", () => {
    const fixes = generateFixes([
      { severity: "critical", message: "Site is not using HTTPS — traffic isn't encrypted" },
      { severity: "warning", message: "Page is missing a <title> tag — hurts SEO" },
    ]);
    expect(fixes).toHaveLength(2);
    for (const fix of fixes) {
      expect(fix.steps.length).toBeGreaterThan(0);
    }
  });

  it("gives certificate steps for the HTTPS issue", () => {
    const [fix] = generateFixes([
      { severity: "critical", message: "Site is not using HTTPS — traffic isn't encrypted" },
    ]);
    expect(fix.steps.some((step) => /certificate/i.test(step.title))).toBe(true);
  });

  it("falls back to a generic step for an unknown issue", () => {
    const [fix] = generateFixes([{ severity: "minor", message: "Something unusual happened" }]);
    expect(fix.steps).toHaveLength(1);
    expect(fix.steps[0].title).toBe("Investigate this issue");
  });

  it("returns nothing when there are no issues", () => {
    expect(generateFixes([])).toEqual([]);
  });
});
