const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug2() {
  try {
     const exams = await prisma.exam.count();
     console.log('Exams Count:', exams);
     
     const colleges = await prisma.college.count();
     console.log('Colleges Count:', colleges);
  } catch (e) {
     console.error('CRASHED AT EXAM/COLLEGE COUNT:', e);
  }
  await prisma.$disconnect();
}

debug2();
