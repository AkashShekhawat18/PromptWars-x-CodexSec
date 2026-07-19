import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const demoEmail = "demo@neuroflow.ai";
    const demoName = "Demo Admin";
    
    // Find or create the demo user
    let user = await prisma.user.findUnique({
      where: { email: demoEmail }
    });

    if (!user) {
      const passwordHash = await bcrypt.hash("demo12345", 10);
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: demoName,
          passwordHash,
          role: "SUPER_ADMIN",
          status: "ACTIVE"
        }
      });
    } else if (user.role !== "SUPER_ADMIN" || user.status !== "ACTIVE") {
      // Ensure it's an active super admin just in case
      user = await prisma.user.update({
        where: { email: demoEmail },
        data: { role: "SUPER_ADMIN", status: "ACTIVE" }
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id, user.email, user.role, user.status);

    // Save session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const cookieStore = await cookies();
    
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Failed to perform demo login" }, { status: 500 });
  }
}
