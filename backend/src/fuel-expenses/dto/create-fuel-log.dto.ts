import { IsString, IsNumber, IsDateString } from 'class-validator';

// ponytail: minimum valid DTO
export class CreateFuelLogDto {
  @IsString()
  vehicleId: string;

  @IsNumber()
  liters: number;

  @IsNumber()
  cost: number;

  @IsNumber()
  odometer: number;

  @IsDateString()
  fuelDate: string;
}
