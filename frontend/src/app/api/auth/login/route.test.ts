import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    session: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    }
  }
}));

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: any) => {
    return new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  it("should return 400 for invalid body", async () => {
    const req = createRequest({ email: "invalid" }); // missing password
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 401 for incorrect password", async () => {
    const req = createRequest({ email: "test@example.com", password: "wrongpassword" });
    const mockHash = await bcrypt.hash("correctpassword", 1);
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      passwordHash: mockHash,
      name: "Test",
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should successfully log in and return cookies", async () => {
    const req = createRequest({ email: "test@example.com", password: "correctpassword" });
    const mockHash = await bcrypt.hash("correctpassword", 1);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "test@example.com",
      passwordHash: mockHash,
      name: "Test",
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.user.email).toBe("test@example.com");

    const cookies = res.headers.getSetCookie();
    expect(cookies.some(c => c.includes("accessToken="))).toBe(true);
    expect(cookies.some(c => c.includes("refreshToken="))).toBe(true);
    
    // Ensure session fixation prevention
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({ where: { userId: "1" } });
  });

  it("should block suspended users", async () => {
    const req = createRequest({ email: "bad@example.com", password: "password123" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "2",
      email: "bad@example.com",
      passwordHash: "hash",
      name: "Bad",
      role: "USER",
      status: "SUSPENDED",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("suspended");
  });
});
