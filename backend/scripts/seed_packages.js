const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing to avoid duplicates if re-run
  try { await prisma.package.deleteMany(); } catch (e) {}

  const packages = [
    {
      name: 'Basic',
      price: 'Free',
      benefits: ['Static Predictor access', 'College Explorer access'],
      actionText: 'Current Plan',
      isFeatured: false
    },
    {
      name: 'Standard',
      price: '₹499/Month',
      benefits: ['Custom rank prediction', 'Mentorship sessions (2/month)'],
      actionText: 'Upgrade Now',
      isFeatured: false
    },
    {
      name: 'VIP Full',
      price: '₹999/Month',
      benefits: ['Unlimited predictions', 'Unlimited mentorship sessions', 'Priority counsellor access'],
      actionText: 'Get VIP Access',
      isFeatured: true
    }
  ];

  for (const p of packages) {
    await prisma.package.create({ data: p });
  }

  console.log('Successfully seeded VIP Packages.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
