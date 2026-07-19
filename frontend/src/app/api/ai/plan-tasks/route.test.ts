import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";
import { planTasks } from "@/lib/gemini";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(async (ops) => Promise.all(ops)),
    task: {
      create: vi.fn((data) => Promise.resolve({ ...data.data, id: "mocked-id" })),
    }
  }
}));

vi.mock("@/lib/api-auth", () => ({
  requireAuthUser: vi.fn()
}));

vi.mock("@/lib/gemini", () => ({
  planTasks: vi.fn()
}));

describe("POST /api/ai/plan-tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test_key";
  });

  const createRequest = (body: any, headers = {}) => {
    return new NextRequest("http://localhost/api/ai/plan-tasks", {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers(headers)
    });
  };

  it("should return 401 if unauthorized", async () => {
    vi.mocked(requireAuthUser).mockRejectedValue(new Error("UNAUTHORIZED"));
    const req = createRequest({ goal: "test" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should reject payloads that are too large", async () => {
    vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1" } as any);
    const req = createRequest({ goal: "test" }, { "content-length": "200000" }); // 200KB
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("should reject goals that are too long", async () => {
    vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1" } as any);
    const longGoal = "a".repeat(1001);
    const req = createRequest({ goal: longGoal }, { "content-length": "1001" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("exceeds maximum length");
  });

  it("should plan and save tasks successfully", async () => {
    vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1" } as any);
    vi.mocked(planTasks).mockResolvedValue([
      { title: "Task 1", priority: "HIGH", description: "Desc 1" },
      { title: "Task 2", priority: "INVALID_PRIORITY", description: "" } // Should sanitize to MEDIUM
    ]);

    const req = createRequest({ goal: "test goal" }, { "content-length": "20" });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.tasks).toHaveLength(2);
    
    // Verify sanitization
    expect(data.tasks[0].priority).toBe("HIGH");
    expect(data.tasks[1].priority).toBe("MEDIUM");
    expect(data.tasks[0].userId).toBe("user-1");
  });
});
