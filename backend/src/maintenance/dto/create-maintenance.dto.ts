import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({
    example: 'clz1abc123xyz456',
    description: 'Vehicle ID',
  })
  @IsString() // Use () if your IDs are UUIDs instead of cuid()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: 'user123abc456',
    description: 'User ID who created the maintenance record',
  })
  @IsString()
  @IsNotEmpty()
  createdById: string;

  @ApiProperty({
    example: 'Oil Change',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    example: 2500,
    description: 'Maintenance cost',
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  cost: number;

  @ApiProperty({
    example: '2026-07-12',
  })
  @IsDateString()
  startDate: Date;


  @ApiProperty({
    enum: MaintenanceStatus,
    default: MaintenanceStatus.OPEN,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus = MaintenanceStatus.OPEN;
}
