import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = 'fleetmanager@transitops.com';
  const password = 'admin123';

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.warn('Fleet Manager already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: 'Fleet Manager',
      email,
      passwordHash,
      role: Role.FLEET_MANAGER,
    },
  });

  console.warn('Fleet Manager created successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed.');

    if (error instanceof Error) {
      console.error(error);
    }

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
