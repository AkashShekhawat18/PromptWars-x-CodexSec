import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    session: {
      create: vi.fn(),
    }
  }
}));

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: any) => {
    return new NextRequest("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  it("should fail validation on weak password", async () => {
    const req = createRequest({ email: "test@example.com", password: "weak" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Password must be at least 8 characters");
  });

  it("should fail validation on invalid email", async () => {
    const req = createRequest({ email: "notanemail", password: "strongpassword" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should fail if email exists", async () => {
    const req = createRequest({ email: "existing@example.com", password: "strongpassword123" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "1" } as any);
    
    const res = await POST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("Email already in use");
  });

  it("should create user and return tokens", async () => {
    const req = createRequest({ email: "new@example.com", password: "strongpassword123", name: "New User" });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "new_1",
      email: "new@example.com",
      name: "New User",
      role: "USER",
      status: "PENDING"
    } as any);

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.user.email).toBe("new@example.com");

    const cookies = res.headers.getSetCookie();
    expect(cookies.some(c => c.includes("accessToken="))).toBe(true);
    expect(cookies.some(c => c.includes("refreshToken="))).toBe(true);
  });
});
