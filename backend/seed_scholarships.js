require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding scholarships...');
  
  // Check if already seeded
  const existing = await prisma.scholarship.count();
  if (existing > 0) {
    console.log(`Already have ${existing} scholarships. Skipping.`);
    return;
  }

  await prisma.scholarship.createMany({
    data: [
      {
        name: 'Counselling Excellence Scholarship',
        amount: 'Up to 100% Waiver',
        description: 'Based on merit scores and academic performance.',
        eligibility: 'Top 10% rank holders in any national entrance exam.',
        officialUrl: 'https://eduguide.com/scholarships/excellence'
      },
      {
        name: 'STEM Merits Grant Aid',
        amount: 'Flat ₹50,000 Support',
        description: 'For specialized STEM candidates with strong entrance scores.',
        eligibility: 'JEE/NEET rank under 10,000 with valid category certificate.',
        officialUrl: 'https://eduguide.com/scholarships/stem'
      },
      {
        name: 'Need-Based Aid Waiver',
        amount: 'Variable support',
        description: 'For students from economically weaker sections with good academics.',
        eligibility: 'Family income below ₹3 LPA with 75%+ marks in qualifying exam.',
        officialUrl: 'https://eduguide.com/scholarships/needbased'
      },
      {
        name: 'Girl Child Education Grant',
        amount: '₹25,000 Annual',
        description: 'Supporting female students pursuing higher education in STEM.',
        eligibility: 'Female students enrolled in Engineering/Medical programs.',
        officialUrl: 'https://eduguide.com/scholarships/girlchild'
      },
      {
        name: 'Sports Excellence Aid',
        amount: '₹15,000 One-time',
        description: 'Recognizing students with achievements in national-level sports.',
        eligibility: 'National/State level sports certificate holders.',
        officialUrl: 'https://eduguide.com/scholarships/sports'
      }
    ]
  });
  
  console.log('✅ Scholarships seeded successfully!');
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
