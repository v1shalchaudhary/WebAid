import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit } from "@/lib/rateLimit";

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("allows requests up to the limit and then blocks", () => {
    const key = "test:limit";
    expect(checkRateLimit(key, 3, 1000).allowed).toBe(true);
    expect(checkRateLimit(key, 3, 1000).allowed).toBe(true);
    expect(checkRateLimit(key, 3, 1000).allowed).toBe(true);
    expect(checkRateLimit(key, 3, 1000).allowed).toBe(false);
  });

  it("tracks each key separately", () => {
    checkRateLimit("test:a", 1, 1000);
    expect(checkRateLimit("test:a", 1, 1000).allowed).toBe(false);
    expect(checkRateLimit("test:b", 1, 1000).allowed).toBe(true);
  });

  it("tells the caller how long to wait when blocked", () => {
    checkRateLimit("test:wait", 1, 5000);
    const blocked = checkRateLimit("test:wait", 1, 5000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("allows requests again once the window has passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    checkRateLimit("test:reset", 1, 1000);
    expect(checkRateLimit("test:reset", 1, 1000).allowed).toBe(false);

    vi.setSystemTime(new Date("2026-01-01T00:00:02Z"));
    expect(checkRateLimit("test:reset", 1, 1000).allowed).toBe(true);
  });
});
