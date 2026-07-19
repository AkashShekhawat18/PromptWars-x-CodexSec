import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, validatePasswordStrength } from "./auth";

describe("Auth Library", () => {
  it("should hash and verify passwords correctly", async () => {
    const password = "SuperSecretPassword123!";
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
    
    const isInvalid = await verifyPassword("WrongPassword", hash);
    expect(isInvalid).toBe(false);
  }, 15000);

  it("should validate password strength", async () => {
    const strongPassword = await validatePasswordStrength("StrongPass123");
    expect(strongPassword.valid).toBe(true);
    expect(strongPassword.errors).toHaveLength(0);

    const weakPassword = await validatePasswordStrength("weak");
    expect(weakPassword.valid).toBe(false);
    expect(weakPassword.errors).toContain("Password must be at least 8 characters");
    expect(weakPassword.errors).toContain("Password must contain an uppercase letter");
    expect(weakPassword.errors).toContain("Password must contain a number");
  });
});
