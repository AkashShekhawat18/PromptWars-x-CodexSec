import { NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";

export async function GET() {
  try {
    const user = await requireAuthUser();
    
    // Split name into first and last name safely
    const nameParts = (user.name || "").trim().split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    return Response.json({ 
      id: user.id,
      firstName, 
      lastName, 
      email: user.email,
      role: user.role
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[User Profile Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
