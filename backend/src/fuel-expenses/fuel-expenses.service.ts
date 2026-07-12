import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

// ponytail: No over-engineering. Direct db access. Minimum viable logic.
@Injectable()
export class FuelExpensesService {
  constructor(private prisma: PrismaService) {}

  async findFuelLogs(vehicleId?: string) {
    return await this.prisma.fuelLog.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      orderBy: { fuelDate: 'desc' },
    });
  }

  async createFuelLog(dto: CreateFuelLogDto) {
    return await this.prisma.fuelLog.create({
      data: {
        ...dto,
        fuelDate: new Date(dto.fuelDate),
      },
    });
  }

  async findExpenses(vehicleId?: string) {
    return await this.prisma.expense.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      orderBy: { expenseDate: 'desc' },
    });
  }

  async createExpense(dto: CreateExpenseDto) {
    return await this.prisma.expense.create({
      data: {
        ...dto,
        expenseDate: new Date(dto.expenseDate),
      },
    });
  }
}
