import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ExpenseType } from '@prisma/client';

// ponytail: minimum valid DTO
export class CreateExpenseDto {
  @IsString()
  vehicleId: string;

  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  expenseDate: string;
}
