import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    name: 'Fleet Manager',
    email: 'fleetmanager@transitops.com',
    password: 'admin123',
    role: Role.FLEET_MANAGER,
  },
  {
    name: 'Dispatcher',
    email: 'dispatcher@transitops.com',
    password: 'admin123',
    role: Role.DISPATCHER,
  },
  {
    name: 'Safety Officer',
    email: 'safetyofficer@transitops.com',
    password: 'admin123',
    role: Role.SAFETY_OFFICER,
  },
  {
    name: 'Financial Analyst',
    email: 'financialanalyst@transitops.com',
    password: 'admin123',
    role: Role.FINANCIAL_ANALYST,
  },
];

async function main(): Promise<void> {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      console.warn(`${user.role} already exists.`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });

    console.warn(`${user.role} created successfully.`);
  }
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
