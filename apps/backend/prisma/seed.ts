import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Services ────────────────────────────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'svc-001' },
      update: {},
      create: {
        id: 'svc-001',
        name: 'Personal Training',
        description: 'One-on-one session tailored to your fitness goals.',
        price: 75.0,
        duration: 60,
      },
    }),
    prisma.service.upsert({
      where: { id: 'svc-002' },
      update: {},
      create: {
        id: 'svc-002',
        name: 'Nutrition Plan',
        description: 'Custom meal plan designed for your body type and goals.',
        price: 50.0,
        duration: 45,
      },
    }),
    prisma.service.upsert({
      where: { id: 'svc-003' },
      update: {},
      create: {
        id: 'svc-003',
        name: 'Group Fitness Class',
        description: 'High-energy group workout. Max 8 participants.',
        price: 25.0,
        duration: 45,
      },
    }),
    prisma.service.upsert({
      where: { id: 'svc-004' },
      update: {},
      create: {
        id: 'svc-004',
        name: 'Stretching & Recovery',
        description: 'Deep stretching and mobility session for recovery.',
        price: 40.0,
        duration: 30,
      },
    }),
  ]);

  // ─── Specialists ─────────────────────────────────────────────────────────────
  const specialists = await Promise.all([
    prisma.specialist.upsert({
      where: { id: 'spec-001' },
      update: {},
      create: {
        id: 'spec-001',
        name: 'Alex Novak',
        description: 'Certified strength & conditioning coach with a passion for powerlifting.',
        experience: 7,
        services: {
          create: [
            { serviceId: 'svc-001' },
            { serviceId: 'svc-004' },
          ],
        },
      },
    }),
    prisma.specialist.upsert({
      where: { id: 'spec-002' },
      update: {},
      create: {
        id: 'spec-002',
        name: 'Maria Costa',
        description: 'Sports nutritionist and personal trainer. Specializes in weight loss and body recomposition.',
        experience: 5,
        services: {
          create: [
            { serviceId: 'svc-001' },
            { serviceId: 'svc-002' },
          ],
        },
      },
    }),
    prisma.specialist.upsert({
      where: { id: 'spec-003' },
      update: {},
      create: {
        id: 'spec-003',
        name: 'Jordan Lee',
        description: 'Group fitness instructor and yoga enthusiast.',
        experience: 4,
        services: {
          create: [
            { serviceId: 'svc-003' },
            { serviceId: 'svc-004' },
          ],
        },
      },
    }),
  ]);

  // ─── Time Slots ──────────────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slotData = [];
  for (let day = 1; day <= 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);

    const hours = [9, 10, 11, 13, 14, 15, 16];
    for (const hour of hours) {
      for (const specId of ['spec-001', 'spec-002', 'spec-003']) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(hour + 1, 0, 0, 0);

        slotData.push({ specialistId: specId, startTime, endTime });
      }
    }
  }

  await prisma.timeSlot.createMany({ data: slotData, skipDuplicates: true });

  // ─── Admin User ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@trainix.com' },
    update: {},
    create: {
      email: 'admin@trainix.com',
      password: hashedPassword,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Seeded ${services.length} services, ${specialists.length} specialists`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
