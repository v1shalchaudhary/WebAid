import { describe, it, expect } from "vitest";
import { normalizeUrl, safeFetch, ScanUrlError } from "@/lib/safeFetch";

describe("normalizeUrl", () => {
  it("adds https when no scheme is given", () => {
    expect(normalizeUrl("example.com").toString()).toBe("https://example.com/");
  });

  it("keeps an http URL as it is", () => {
    expect(normalizeUrl("http://example.com").protocol).toBe("http:");
  });

  it("rejects URLs that contain a username or password", () => {
    expect(() => normalizeUrl("https://user:pass@example.com")).toThrow(ScanUrlError);
  });

  it("rejects text that is not a URL", () => {
    expect(() => normalizeUrl("not a url with spaces")).toThrow(ScanUrlError);
  });
});

// These all fail at the address check, before any network request is made.
describe("safeFetch private address blocking", () => {
  it.each([
    "http://localhost",
    "http://foo.localhost",
    "http://printer.local",
    "http://db.internal",
    "http://127.0.0.1",
    "http://2130706433",
    "http://0.0.0.0",
    "http://10.1.2.3",
    "http://172.16.0.5",
    "http://192.168.1.10",
    "http://169.254.169.254",
    "http://[::1]",
    "http://[::ffff:127.0.0.1]",
  ])("blocks %s", async (url) => {
    await expect(safeFetch(new URL(url))).rejects.toThrow(ScanUrlError);
  });
});
