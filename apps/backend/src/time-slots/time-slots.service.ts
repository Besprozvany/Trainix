import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';

@Injectable()
export class TimeSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  findBySpecialist(specialistId: string) {
    return this.prisma.timeSlot.findMany({
      where: {
        specialistId,
        isAvailable: true,
        startTime: { gt: new Date() },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async create(dto: CreateTimeSlotDto) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    if (dto.startTime < new Date()) {
      throw new BadRequestException('Cannot create a slot in the past');
    }

    const conflict = await this.prisma.timeSlot.findFirst({
      where: {
        specialistId: dto.specialistId,
        OR: [
          {
            startTime: { lt: dto.endTime },
            endTime: { gt: dto.startTime },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Time slot overlaps with an existing slot');
    }

    return this.prisma.timeSlot.create({ data: dto });
  }

  async generateWeeklySlots(specialistId: string) {
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);

      const hours = [9, 10, 11, 13, 14, 15, 16, 17];
      for (const hour of hours) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);

        slots.push({ specialistId, startTime, endTime });
      }
    }

    await this.prisma.timeSlot.createMany({ data: slots, skipDuplicates: true });

    return { created: slots.length };
  }
}
