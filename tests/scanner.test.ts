import { describe, it, expect } from "vitest";
import { runChecks } from "@/lib/scanner";

const GOOD_HTML = `<html><head><title>Hello</title><meta name="description" content="A page"></head><body><img src="a.png" alt="a"></body></html>`;

function run(
  over: Partial<{ url: string; status: number; ms: number; html: string }> = {}
) {
  return runChecks(
    over.url ?? "https://example.com/",
    over.status ?? 200,
    over.ms ?? 100,
    over.html ?? GOOD_HTML
  );
}

describe("runChecks", () => {
  it("gives a clean page 100 and no issues", () => {
    const result = run();
    expect(result.score).toBe(100);
    expect(result.issues).toEqual([]);
  });

  it("flags a site that is not on HTTPS as critical", () => {
    const result = run({ url: "http://example.com/" });
    expect(result.score).toBe(75);
    expect(result.issues[0].severity).toBe("critical");
    expect(result.issues[0].message).toContain("HTTPS");
  });

  it("flags a slow response", () => {
    expect(run({ ms: 2500 }).score).toBe(85);
  });

  it("flags an error status code", () => {
    expect(run({ status: 404 }).score).toBe(60);
  });

  it("flags a missing title", () => {
    const html = `<html><head><meta name="description" content="x"></head><body></body></html>`;
    expect(run({ html }).score).toBe(90);
  });

  it("flags a missing meta description", () => {
    const html = `<html><head><title>Hi</title></head><body></body></html>`;
    expect(run({ html }).score).toBe(90);
  });

  it("counts images without alt text", () => {
    const html = `<html><head><title>Hi</title><meta name="description" content="x"></head><body>${'<img src="x.png">'.repeat(3)}</body></html>`;
    const result = run({ html });
    expect(result.score).toBe(94);
    expect(result.issues[0].message).toContain("3 image(s)");
  });

  it("never scores below 0", () => {
    const html = `<html><body>${'<img src="x.png">'.repeat(10)}</body></html>`;
    const result = run({ url: "http://example.com/", status: 500, ms: 5000, html });
    expect(result.score).toBe(0);
  });
});
