export class CreateFuelLogDto {
  vehicleId: string;
  tripId?: string;
  gallons: number;
  cost: number;
}
