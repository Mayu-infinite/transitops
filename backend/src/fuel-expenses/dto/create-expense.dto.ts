export class CreateExpenseDto {
  vehicleId: string;
  tripId?: string;
  amount: number;
  description: string;
}
