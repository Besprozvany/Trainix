import { Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

export class CreateTimeSlotDto {
  @IsUUID()
  specialistId: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;
}
