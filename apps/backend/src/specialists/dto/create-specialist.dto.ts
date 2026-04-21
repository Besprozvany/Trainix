import { IsArray, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class CreateSpecialistDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsInt()
  @Min(0)
  experience: number;

  @IsArray()
  @IsUUID('all', { each: true })
  serviceIds: string[];
}
