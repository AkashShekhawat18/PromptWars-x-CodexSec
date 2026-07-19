import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-jwt-secret-do-not-use-in-production-32chars!";

const ALLOWED_ROLES = ["ADMIN", "SUPER_ADMIN"];
const ALLOWED_STATUSES = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];
const ALLOWED_ROLES_VALUES = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey, {
      audience: "neuroflow-app",
      issuer: "neuroflow-api",
    });
    return payload;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser || !ALLOWED_ROLES.includes(adminUser.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const resolvedParams = await params;
    const targetUserId = resolvedParams.id;

    // --- INPUT VALIDATION: Only allow known fields ---
    const { status, role, reason } = body;

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
    if (role && !ALLOWED_ROLES_VALUES.includes(role)) {
      return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
    }

    // Sanitize reason field
    const sanitizedReason = reason ? String(reason).substring(0, 500) : null;

    // Build update data strictly — no arbitrary field injection
    const updateData: { status?: string; role?: string } = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Prevent self-demotion or self-suspension
    if (adminUser.userId === targetUserId && (status === "SUSPENDED" || role === "USER")) {
      return NextResponse.json({ error: "Cannot downgrade or suspend your own account" }, { status: 400 });
    }

    // MODERATOR role can only approve/reject but not promote to admin
    if (adminUser.role === "ADMIN" && role && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Insufficient privileges to grant admin roles" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      // Select only fields needed — never return passwordHash
      select: { id: true, email: true, name: true, role: true, status: true },
      data: updateData,
    });

    if (status) {
      await prisma.userVerification.create({
        data: {
          userId: targetUserId,
          status,
          reason: sanitizedReason,
          reviewedBy: adminUser.userId as string,
        },
      });
    }

    await prisma.adminActionLog.create({
      data: {
        adminId: adminUser.userId as string,
        action: status ? `USER_STATUS_CHANGED_${status}` : `USER_ROLE_CHANGED_${role}`,
        targetId: targetUserId,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    // Never expose internal error details
    console.error("[Admin PATCH] Error:", (error as Error).message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser || adminUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only Super Admins can delete users" }, { status: 403 });
    }

    const resolvedParams = await params;
    const targetUserId = resolvedParams.id;

    if (!targetUserId || typeof targetUserId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (adminUser.userId === targetUserId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: targetUserId } });

    await prisma.adminActionLog.create({
      data: {
        adminId: adminUser.userId as string,
        action: "USER_DELETED",
        targetId: targetUserId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin DELETE] Error:", (error as Error).message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
