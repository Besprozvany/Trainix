import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: dto.timeSlotId },
    });

    if (!timeSlot) throw new NotFoundException('Time slot not found');
    if (!timeSlot.isAvailable) {
      throw new BadRequestException('Time slot is already booked');
    }
    if (timeSlot.startTime < new Date()) {
      throw new BadRequestException('Cannot book a past time slot');
    }
    if (timeSlot.specialistId !== dto.specialistId) {
      throw new BadRequestException('Time slot does not belong to this specialist');
    }

    const overlap = await this.prisma.booking.findFirst({
      where: {
        userId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        timeSlot: {
          startTime: { lt: timeSlot.endTime },
          endTime: { gt: timeSlot.startTime },
        },
      },
    });

    if (overlap) {
      throw new BadRequestException('You already have a booking at this time');
    }

    const [booking] = await this.prisma.$transaction([
      this.prisma.booking.create({
        data: {
          userId,
          specialistId: dto.specialistId,
          serviceId: dto.serviceId,
          timeSlotId: dto.timeSlotId,
          notes: dto.notes,
        },
        include: {
          service: true,
          specialist: true,
          timeSlot: true,
        },
      }),
      this.prisma.timeSlot.update({
        where: { id: dto.timeSlotId },
        data: { isAvailable: false },
      }),
    ]);

    return booking;
  }

  findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        specialist: true,
        timeSlot: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(bookingId: string, userId: string, userRole: Role) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isOwner = booking.userId === userId;
    const isSpecialist = booking.specialistId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!isOwner && !isSpecialist && !isAdmin) {
      throw new ForbiddenException('Not allowed to cancel this booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      }),
      this.prisma.timeSlot.update({
        where: { id: booking.timeSlotId },
        data: { isAvailable: true },
      }),
    ]);

    return updated;
  }

  async confirm(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });
  }
}
