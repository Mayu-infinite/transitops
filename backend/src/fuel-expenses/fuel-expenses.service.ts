import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuelExpensesService {
  constructor(private prisma: PrismaService) {}

  async findFuelLogs(vehicleId?: string) {
    return [];
  }

  async createFuelLog(dto: any) {
    return {};
  }

  async findExpenses(vehicleId?: string) {
    return [];
  }

  async createExpense(dto: any) {
    return {};
  }
}
