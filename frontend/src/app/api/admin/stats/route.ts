import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const pendingUsers = await prisma.user.count({ where: { status: "PENDING" } });
    const approvedUsers = await prisma.user.count({ where: { status: "ACTIVE" } });
    const rejectedUsers = await prisma.user.count({ where: { status: "REJECTED" } });
    const suspendedUsers = await prisma.user.count({ where: { status: "SUSPENDED" } });
    
    const uploadedDocuments = await prisma.document.count();
    const storageUsage = await prisma.document.aggregate({ _sum: { size: true } });
    
    const aiRequestsToday = await prisma.chatMessage.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }
    });

    const workflowsCreated = await prisma.workflow.count();

    return NextResponse.json({
      totalUsers,
      pendingVerifications: pendingUsers,
      approvedUsers,
      rejectedUsers,
      activeUsers: approvedUsers,
      suspendedUsers,
      uploadedDocuments,
      aiRequestsToday,
      workflowsCreated,
      storageUsage: storageUsage._sum.size || 0,
      systemHealth: "Operational" // Mocked for now
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
