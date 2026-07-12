import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
export class CreateFuelLogDto {
  @ApiProperty({
    example: 'clz1abc123xyz456',
    description: 'Vehicle ID',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: 45.5,
    description: 'Fuel quantity in liters',
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  liters: number;

  @ApiProperty({
    example: 4200,
    description: 'Fuel cost',
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  cost: number;

  @ApiProperty({
    example: 125670,
    description: 'Vehicle odometer reading',
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  odometer: number;

  @ApiProperty({
    example: '2026-07-12',
  })
  @IsDateString()
  fuelDate: string;
}
