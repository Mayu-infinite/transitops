import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus, VehicleType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'GJ01AB1234',
    description: 'Unique vehicle registration number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)

  @ApiProperty({
    example: 'Tata Ace',
    description: 'Vehicle name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Ace Gold Petrol',
    description: 'Vehicle model',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model: string;

  @ApiProperty({
    enum: VehicleType,
    example: VehicleType.VAN,
  })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({
    example: 1200,
    description: 'Maximum load capacity in kg',
  })
  @IsNumber()
  @IsPositive()
  maxLoadCapacity: number;

  @ApiProperty({
    example: 15000,
    description: 'Current odometer reading',
  })
  @IsNumber()
  @Min(0)
  odometer: number;

  @ApiProperty({
    example: 850000,
    description: 'Vehicle acquisition cost',
  })
  @IsNumber()
  @IsPositive()
  acquisitionCost: number;

  @ApiProperty({
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
