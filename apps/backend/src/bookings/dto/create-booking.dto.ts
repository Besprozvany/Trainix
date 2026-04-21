import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  specialistId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  timeSlotId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
