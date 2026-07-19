import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("Rate Limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should allow requests under the limit for auth", async () => {
    const identifier = "test_ip";
    const res1 = await checkRateLimit(identifier, true);
    expect(res1.success).toBe(true);
    expect(res1.limit).toBe(5);
  });

  it("should block requests over the limit", async () => {
    const identifier = "test_ip_2";
    // Auth limit is 5. Make 5 requests.
    for (let i = 0; i < 5; i++) {
      const res = await checkRateLimit(identifier, true);
      expect(res.success).toBe(true);
    }
    // 6th should fail
    const resFail = await checkRateLimit(identifier, true);
    expect(resFail.success).toBe(false);
    expect(resFail.remaining).toBe(0);
  });

  it("should reset after window expires", async () => {
    const identifier = "test_ip_3";
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(identifier, true);
    }
    const resFail = await checkRateLimit(identifier, true);
    expect(resFail.success).toBe(false);

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61000);

    const resSuccess = await checkRateLimit(identifier, true);
    expect(resSuccess.success).toBe(true);
  });
});
