const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const normalizedEmail = "user@neuroflow.ai";
const password = "user1234";

async function test() {
  try {
    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 12);
      user = await prisma.user.create({
        data: { email: normalizedEmail, name: "Demo User", passwordHash, role: "USER", status: "ACTIVE" },
      });
      console.log("User created:", user);
    }

    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.session.create({
      data: {
        sessionToken: "dummy-refresh-token",
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    console.log("Session created successfully.");
  } catch(e) {
    console.error("ERROR CAUGHT:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
