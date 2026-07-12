import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ description: 'Vehicle ID' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Driver ID' })
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty({ description: 'Source location' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Destination location' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ description: 'Cargo weight in kg' })
  @IsNumber()
  @IsPositive()
  cargoWeight: number;

  @ApiProperty({ description: 'Planned distance in km' })
  @IsNumber()
  @IsPositive()
  plannedDistance: number;

  @ApiProperty({ description: 'User ID who created the trip' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
