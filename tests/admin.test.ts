import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@/lib/auth", () => ({ getSession: vi.fn() }));

import { isAdminEmail, getAdminSession } from "@/lib/admin";
import { getSession } from "@/lib/auth";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.mocked(getSession).mockReset();
});

describe("isAdminEmail", () => {
  it("matches listed emails regardless of case or spaces", () => {
    vi.stubEnv("ADMIN_EMAILS", "Owner@Example.com, second@example.com");
    expect(isAdminEmail("owner@example.com")).toBe(true);
    expect(isAdminEmail("OWNER@EXAMPLE.COM")).toBe(true);
    expect(isAdminEmail("second@example.com")).toBe(true);
  });

  it("rejects emails that are not listed", () => {
    vi.stubEnv("ADMIN_EMAILS", "owner@example.com");
    expect(isAdminEmail("other@example.com")).toBe(false);
  });

  it("treats everyone as a non-admin when the list is empty", () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    expect(isAdminEmail("owner@example.com")).toBe(false);
  });
});

describe("getAdminSession", () => {
  it("returns null when nobody is signed in", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    expect(await getAdminSession()).toBeNull();
  });

  it("returns null for a signed-in user who is not an admin", async () => {
    vi.stubEnv("ADMIN_EMAILS", "owner@example.com");
    vi.mocked(getSession).mockResolvedValue({ userId: "u1", email: "someone@example.com" });
    expect(await getAdminSession()).toBeNull();
  });

  it("returns the session for an admin", async () => {
    vi.stubEnv("ADMIN_EMAILS", "owner@example.com");
    const session = { userId: "u1", email: "owner@example.com" };
    vi.mocked(getSession).mockResolvedValue(session);
    expect(await getAdminSession()).toEqual(session);
  });
});
