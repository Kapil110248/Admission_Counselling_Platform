const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.session.findMany({ include: { student: true } });
  console.log("SESSIONS IN DB:", sessions);
}

main().catch(console.error).finally(() => prisma.$disconnect());
