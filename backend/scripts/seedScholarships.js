const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Scholarship Data...');

  const scholarships = [
    {
      name: 'Counselling Excellence Scholarship',
      description: 'Based on merit scores and academic performance in major entrance exams.',
      amount: 'Up to 100% Waiver',
      eligibility: 'Top 1% rank holders',
      officialUrl: 'https://educounsel.com/scholarships/excellence'
    },
    {
      name: 'STEM Merits Grant Aid',
      description: 'Specialized STEM candidates with strong entrance scores and project work.',
      amount: 'Flat ₹50,000 Support',
      eligibility: 'Maths/Physics focused candidates',
      officialUrl: 'https://educounsel.com/scholarships/stem'
    },
    {
      name: 'Need-Based Aid Waiver',
      description: 'For students from economically weaker sections with good academics.',
      amount: 'Variable Support',
      eligibility: 'Income below 5L/year',
      officialUrl: 'https://educounsel.com/scholarships/need-based'
    }
  ];

  for (const s of scholarships) {
    await prisma.scholarship.create({ data: s });
  }

  console.log('Scholarship seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
