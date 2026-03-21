const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  const students = await prisma.user.count({ where: { role: 'Student' } });
  const counsellors = await prisma.user.count({ where: { role: 'Counsellor' } });
  const pendingVerify = await prisma.user.count({ where: { isVerified: false, role: 'Student' } });
  
  console.log('Database Counts Results setup triggers:');
  console.log('Students:', students);
  console.log('Counsellors:', counsellors);
  console.log('Pending Verify:', pendingVerify);
  
  await prisma.$disconnect();
}

debug();
