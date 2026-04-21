import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  specialistId: string;

  @IsString()
  serviceId: string;

  @IsString()
  timeSlotId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
