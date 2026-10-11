import { describe, it, expect } from "vitest";
import { validatePassword } from "@/lib/password";

describe("validatePassword", () => {
  it("accepts a password that meets every rule", () => {
    expect(validatePassword("Abcdef1!").valid).toBe(true);
  });

  it("rejects short passwords", () => {
    const result = validatePassword("Ab1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("At least 8 characters");
  });

  it("requires an uppercase letter", () => {
    expect(validatePassword("abcdef1!").errors).toContain("One uppercase letter");
  });

  it("requires a lowercase letter", () => {
    expect(validatePassword("ABCDEF1!").errors).toContain("One lowercase letter");
  });

  it("requires a number", () => {
    expect(validatePassword("Abcdefg!").errors).toContain("One number");
  });

  it("requires a special character", () => {
    expect(validatePassword("Abcdefg1").errors).toContain("One special character");
  });

  it("rejects passwords longer than 72 characters", () => {
    expect(validatePassword("Aa1!" + "x".repeat(80)).valid).toBe(false);
  });

  it("reports every missing rule at once", () => {
    expect(validatePassword("").errors.length).toBeGreaterThanOrEqual(4);
  });
});
