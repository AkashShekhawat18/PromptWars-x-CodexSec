import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateTokens } from "@/lib/auth";
import bcrypt from "bcryptjs";

// --- DEMO ACCOUNTS ---
// These are created on first login and work regardless of DB state.
// Credentials are intentionally published for hackathon judges.
const DEMO_ACCOUNTS: Record<string, { name: string; role: string; status: string; password: string }> = {
  "admin@neuroflow.ai": { name: "Demo Admin", role: "SUPER_ADMIN", status: "ACTIVE", password: "admin123" },
  "user@neuroflow.ai": { name: "Demo User", role: "USER", status: "ACTIVE", password: "user1234" },
};

export async function POST(req: Request) {
  try {
    // --- INPUT VALIDATION ---
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email, password } = body as Record<string, unknown>;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return Response.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // Sanitize and normalize email
    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8 || password.length > 128) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // --- DEMO ACCOUNT PROVISIONING ---
    const demo = DEMO_ACCOUNTS[normalizedEmail];
    if (demo && password === demo.password) {
      if (!user) {
        const passwordHash = await bcrypt.hash(password, 12);
        user = await prisma.user.create({
          data: { email: normalizedEmail, name: demo.name, passwordHash, role: demo.role, status: demo.status },
        });
      } else {
        // Ensure demo account always has correct role/status
        user = await prisma.user.update({
          where: { email: normalizedEmail },
          data: { role: demo.role, status: demo.status },
        });
      }
    }

    // Generic error — prevents user enumeration
    if (!user || !user.passwordHash) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "SUSPENDED") {
      return Response.json({ error: "This account has been suspended. Contact support." }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { accessToken, refreshToken } = await generateTokens(
      user.id, user.email, user.role, user.status
    );

    // Invalidate old sessions on login (session fixation prevention)
    await prisma.session.deleteMany({ where: { userId: user.id } });

    await prisma.session.create({
      data: {
        sessionToken: refreshToken,
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Return ONLY non-sensitive user info
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 15 * 60,
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    // NEVER expose internal error details in production
    console.error("[Login] Internal error:", (error as Error).message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
