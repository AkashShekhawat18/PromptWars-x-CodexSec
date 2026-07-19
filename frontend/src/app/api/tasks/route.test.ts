import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
    }
  }
}));

vi.mock("@/lib/api-auth", () => ({
  requireAuthUser: vi.fn()
}));

describe("Tasks API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return 401 if unauthorized", async () => {
      vi.mocked(requireAuthUser).mockRejectedValue(new Error("UNAUTHORIZED"));
      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("should return tasks for authorized user", async () => {
      vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1", email: "u@test.com", role: "USER", status: "ACTIVE" });
      vi.mocked(prisma.task.findMany).mockResolvedValue([
        { id: "task-1", title: "Task 1", userId: "user-1" } as any
      ]);

      const res = await GET();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe("task-1");
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("POST /api/tasks", () => {
    const createRequest = (body: any) => {
      return new NextRequest("http://localhost/api/tasks", {
        method: "POST",
        body: JSON.stringify(body),
      });
    };

    it("should return 401 if unauthorized", async () => {
      vi.mocked(requireAuthUser).mockRejectedValue(new Error("UNAUTHORIZED"));
      const req = createRequest({ title: "New Task" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("should reject invalid task data", async () => {
      vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1", email: "u@test.com", role: "USER", status: "ACTIVE" });
      const req = createRequest({ priority: "HIGH" }); // missing title
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("should create a task successfully", async () => {
      vi.mocked(requireAuthUser).mockResolvedValue({ id: "user-1", email: "u@test.com", role: "USER", status: "ACTIVE" });
      vi.mocked(prisma.task.create).mockResolvedValue({
        id: "new-task",
        title: "Buy groceries",
        priority: "HIGH",
        status: "TODO",
        userId: "user-1"
      } as any);

      const req = createRequest({ title: "Buy groceries", priority: "HIGH" });
      const res = await POST(req);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe("new-task");
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: "Buy groceries",
          priority: "HIGH",
          status: "TODO",
          userId: "user-1"
        }
      });
    });
  });
});
