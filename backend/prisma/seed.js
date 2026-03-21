const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  
  const adminPassword = await bcrypt.hash('admin123', salt);
  const counsellorPassword = await bcrypt.hash('counsellor123', salt);
  const studentPassword = await bcrypt.hash('student123', salt);

  console.log('Cleaning existing data for seeding details...');
  await prisma.cutoff.deleteMany();
  await prisma.college.deleteMany();
  await prisma.exam.deleteMany();

  console.log('Seeding dummy users...');

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eduguide.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@eduguide.com', password: adminPassword, role: 'Admin', isVerified: true }
  });

  // Create Counsellor
  await prisma.user.upsert({
    where: { email: 'counsellor@eduguide.com' },
    update: {},
    create: { name: 'Counsellor User', email: 'counsellor@eduguide.com', password: counsellorPassword, role: 'Counsellor', isVerified: true }
  });

  // Create Student
  await prisma.user.upsert({
    where: { email: 'student@eduguide.com' },
    update: {},
    create: { name: 'Student User', email: 'student@eduguide.com', password: studentPassword, role: 'Student', isVerified: true }
  });

  const unverifiedPassword = await bcrypt.hash('user123', salt);
  console.log('Seeding unverified users for dashboard counters...');
  await prisma.user.upsert({
    where: { email: 'rahul@example.com' }, update: {},
    create: { name: 'Rahul Varma', email: 'rahul@example.com', password: unverifiedPassword, role: 'Student', isVerified: false, phone: '9876544321' }
  });

  await prisma.user.upsert({
    where: { email: 'deepa@example.com' }, update: {},
    create: { name: 'Deepa Gupta', email: 'deepa@example.com', password: unverifiedPassword, role: 'Student', isVerified: false, phone: '9876544322' }
  });

  console.log('Seeding Exams...');
  const neet = await prisma.exam.upsert({
    where: { id: 1 }, update: {},
    create: { id: 1, name: 'NEET UG', board: 'NTA', date: '2026-05-05', stream: 'Medical' }
  });

  const jee = await prisma.exam.upsert({
    where: { id: 2 }, update: {},
    create: { id: 2, name: 'JEE Main', board: 'NTA', date: '2026-04-12', stream: 'Engineering' }
  });

  console.log('Seeding Colleges & Cutoffs...');
  // Medical Colleges for NEET
  const aiimsDelhi = await prisma.college.create({
    data: { name: 'AIIMS Delhi', location: 'New Delhi', nirfRank: '1', fees: '1625/yr', avgPackage: '25 LPA' }
  });
  const mamc = await prisma.college.create({
    data: { name: 'Maulana Azad Medical College', location: 'New Delhi', nirfRank: '4', fees: '3000/yr', avgPackage: '18 LPA' }
  });

  await prisma.cutoff.createMany({
    data: [
      { collegeId: aiimsDelhi.id, examId: neet.id, branch: 'MBBS', category: 'General', closingRank: 50 },
      { collegeId: aiimsDelhi.id, examId: neet.id, branch: 'MBBS', category: 'OBC', closingRank: 250 },
      { collegeId: mamc.id, examId: neet.id, branch: 'MBBS', category: 'General', closingRank: 200 }
    ]
  });

  // Engineering Colleges for JEE
  const iitb = await prisma.college.create({
    data: { name: 'IIT Bombay', location: 'Mumbai', nirfRank: '3', fees: '2,11,000/yr', avgPackage: '32 LPA' }
  });
  const iitd = await prisma.college.create({
    data: { name: 'IIT Delhi', location: 'New Delhi', nirfRank: '2', fees: '2,20,000/yr', avgPackage: '28 LPA' }
  });

  await prisma.cutoff.createMany({
    data: [
      { collegeId: iitb.id, examId: jee.id, branch: 'Computer Science', category: 'General', closingRank: 65 },
      { collegeId: iitb.id, examId: jee.id, branch: 'Electrical', category: 'General', closingRank: 350 },
      { collegeId: iitd.id, examId: jee.id, branch: 'Computer Science', category: 'General', closingRank: 110 }
    ]
  });

  console.log('Seed completed successfully with predicts data!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
