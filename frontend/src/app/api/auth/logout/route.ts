import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Invalidate session in database to prevent token reuse
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { sessionToken: refreshToken },
      });
    }

    const response = NextResponse.json({ success: true });

    // Clear both cookies immediately with expired date
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error("[Logout] Error:", (error as Error).message);
    // Even on error, clear cookies so user is logged out client-side
    const response = NextResponse.json({ success: true });
    response.cookies.set("accessToken", "", { expires: new Date(0), path: "/" });
    response.cookies.set("refreshToken", "", { expires: new Date(0), path: "/" });
    return response;
  }
}
