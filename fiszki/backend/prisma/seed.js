const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.group.count();
  if (count > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  await prisma.group.createMany({
    data: [{ name: 'Sport' }, { name: 'Hobby' }, { name: 'Verbs' }],
  });

  console.log('Seeded 3 default groups: Sport, Hobby, Verbs');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
