import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateTripDto extends PartialType(CreateTripDto) {}

export class CompleteTripDto {
  @ApiProperty({ description: 'Actual distance traveled' })
  @IsNumber()
  @IsPositive()
  actualDistance: number;

  @ApiProperty({ description: 'Final odometer reading' })
  @IsNumber()
  @IsPositive()
  finalOdometer: number;
}
