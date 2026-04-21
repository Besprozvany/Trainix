import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.specialist.findMany({
      include: {
        services: { include: { service: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialist = await this.prisma.specialist.findUnique({
      where: { id },
      include: {
        services: { include: { service: true } },
        _count: { select: { bookings: true } },
      },
    });

    if (!specialist) throw new NotFoundException('Specialist not found');

    return specialist;
  }

  async getAvailability(id: string, date?: string) {
    await this.findOne(id);

    const where: Record<string, unknown> = {
      specialistId: id,
      isAvailable: true,
      startTime: { gt: new Date() },
    };

    if (date) {
      const from = new Date(date);
      const to = new Date(date);
      to.setDate(to.getDate() + 1);
      where.startTime = { gte: from, lt: to };
    }

    return this.prisma.timeSlot.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  create(dto: CreateSpecialistDto) {
    const { serviceIds, ...data } = dto;
    return this.prisma.specialist.create({
      data: {
        ...data,
        services: {
          create: serviceIds.map((serviceId) => ({ serviceId })),
        },
      },
      include: { services: { include: { service: true } } },
    });
  }
}
