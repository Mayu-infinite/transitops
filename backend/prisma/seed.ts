import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  const adminEmail = 'admin@transitops.com';
  const adminPassword = 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      name: 'Administrator',
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin user created successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('❌ Database seed failed.');

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
