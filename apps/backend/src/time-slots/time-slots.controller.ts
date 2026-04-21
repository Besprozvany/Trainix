import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { TimeSlotsService } from './time-slots.service';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Get('specialist/:id')
  findBySpecialist(@Param('id') id: string) {
    return this.timeSlotsService.findBySpecialist(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SPECIALIST)
  create(@Body() dto: CreateTimeSlotDto) {
    return this.timeSlotsService.create(dto);
  }

  @Post('generate/:specialistId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  generate(@Param('specialistId') specialistId: string) {
    return this.timeSlotsService.generateWeeklySlots(specialistId);
  }
}
