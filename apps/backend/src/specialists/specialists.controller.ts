import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { SpecialistsService } from './specialists.service';

@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Get()
  findAll() {
    return this.specialistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialistsService.findOne(id);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: string, @Query('date') date?: string) {
    return this.specialistsService.getAvailability(id, date);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSpecialistDto) {
    return this.specialistsService.create(dto);
  }
}
