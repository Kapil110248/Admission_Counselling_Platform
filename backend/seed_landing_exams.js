const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultExams = [
  { 
    name: 'NEET', 
    title: 'NEET UG', 
    board: 'NTA', 
    date: 'May 2026', 
    collegeCount: '100+ Colleges', 
    colorClass: 'bg-red-50 text-red-600 border-red-100/50' 
  },
  { 
    name: 'JEE', 
    title: 'JEE Main', 
    board: 'NTA', 
    date: 'April 2026', 
    collegeCount: '300+ Colleges', 
    colorClass: 'bg-blue-50 text-blue-600 border-blue-100/50' 
  },
  { 
    name: 'CUET', 
    title: 'CUET', 
    board: 'NTA', 
    date: 'May 2026', 
    collegeCount: '150+ Colleges', 
    colorClass: 'bg-purple-50 text-purple-600 border-purple-100/50' 
  },
  { 
    name: 'CLAT', 
    title: 'CLAT', 
    board: 'Consortium', 
    date: 'Dec 2025', 
    collegeCount: '50+ Law Schools', 
    colorClass: 'bg-orange-50 text-orange-600 border-orange-100/50' 
  },
  { 
    name: 'BITSAT', 
    title: 'BITSAT', 
    board: 'BITS Pilani', 
    date: 'June 2026', 
    collegeCount: '3 Campuses', 
    colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100/50' 
  },
  { 
    name: 'VITEEE', 
    title: 'VITEEE', 
    board: 'VIT', 
    date: 'April 2026', 
    collegeCount: '4 Campuses', 
    colorClass: 'bg-cyan-50 text-cyan-600 border-cyan-100/50' 
  },
  { 
    name: 'CAT', 
    title: 'CAT Exam', 
    board: 'IIMs', 
    date: 'Nov 2025', 
    collegeCount: '20+ IIMs', 
    colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
  },
  { 
    name: 'GATE', 
    title: 'GATE 2026', 
    board: 'IITs', 
    date: 'Feb 2026', 
    collegeCount: '100+ Institutes', 
    colorClass: 'bg-rose-50 text-rose-600 border-rose-100/50' 
  }
];

async function seedLandingExams() {
  console.log('Seeding landing page exams...');
  for (const item of defaultExams) {
    // Check if exam already exists by name
    const existing = await prisma.exam.findFirst({ where: { name: item.name } });
    if (existing) {
      await prisma.exam.update({
        where: { id: existing.id },
        data: item
      });
      console.log(`Updated exam: ${item.name}`);
    } else {
      await prisma.exam.create({ data: item });
      console.log(`Created exam: ${item.name}`);
    }
  }
  console.log('Seeding completed.');
}

seedLandingExams().catch(e => console.error(e)).finally(() => prisma.$disconnect());
