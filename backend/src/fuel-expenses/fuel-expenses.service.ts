import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { UpdateFuelLogDto } from './dto/update-fuel-log.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryFuelExpenseDto } from './dto/query-fuel-expense.dto';
@Injectable()
export class FuelExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================
  // Fuel Logs
  // ==========================

  async createFuelLog(dto: CreateFuelLogDto) {
    const [fuelLog] = await this.prisma
      .$transaction([
        this.prisma.fuelLog.create({ data: dto }),
        this.prisma.vehicle.update({
          where: { id: dto.vehicleId },
          data: { odometer: dto.odometer },
        }),
      ])
      .catch(() => {
        throw new NotFoundException('Vehicle not found or update failed.');
      });

    return fuelLog;
  }

  async findFuelLogs(query: QueryFuelExpenseDto) {
    const { page = 1, limit = 10, vehicleId } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.FuelLogWhereInput = {
      ...(vehicleId && { vehicleId }),
    };

    const [fuelLogs, total] = await Promise.all([
      this.prisma.fuelLog.findMany({
        where,

        include: {
          vehicle: true,
        },

        skip,
        take: limit,

        orderBy: {
          fuelDate: 'desc',
        },
      }),

      this.prisma.fuelLog.count({
        where,
      }),
    ]);

    return {
      data: fuelLogs,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateFuelLog(id: string, dto: UpdateFuelLogDto) {
    const fuelLog = await this.prisma.fuelLog.findUnique({
      where: {
        id,
      },
    });

    if (!fuelLog) {
      throw new NotFoundException('Fuel log not found.');
    }

    return await this.prisma.fuelLog.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  // ==========================
  // Expenses
  // ==========================

  async createExpense(dto: CreateExpenseDto) {
    return await this.prisma.expense
      .create({
        data: dto,
      })
      .catch(() => {
        throw new NotFoundException('Vehicle not found.');
      });
  }

  async findExpenses(query: QueryFuelExpenseDto) {
    const { page = 1, limit = 10, vehicleId, type, search } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = {
      ...(vehicleId && { vehicleId }),

      ...(type && { type }),

      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,

        include: {
          vehicle: true,
        },

        skip,
        take: limit,

        orderBy: {
          expenseDate: 'desc',
        },
      }),

      this.prisma.expense.count({
        where,
      }),
    ]);

    return {
      data: expenses,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async updateExpense(id: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({
      where: {
        id,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }

    return await this.prisma.expense.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  // ==========================
  // Reports & Analytics
  // ==========================

  async getOperationalCost(vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    const [fuel, expense] = await Promise.all([
      this.prisma.fuelLog.aggregate({
        _sum: { cost: true },
        where: { vehicleId },
      }),
      this.prisma.expense.aggregate({
        _sum: { amount: true },
        where: { vehicleId },
      }),
    ]);

    const fuelCost = Number(fuel._sum.cost ?? 0);
    const expenseCost = Number(expense._sum.amount ?? 0);

    return {
      vehicleId,
      fuelCost,
      expenseCost,
      totalOperationalCost: fuelCost + expenseCost,
    };
  }

  async getFuelEfficiency(vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    const [fuel, trip] = await Promise.all([
      this.prisma.fuelLog.aggregate({
        _sum: { liters: true },
        where: { vehicleId },
      }),
      this.prisma.trip.aggregate({
        _sum: { actualDistance: true },
        where: { vehicleId, status: 'COMPLETED' },
      }),
    ]);

    const totalFuel = fuel._sum.liters ?? 0;
    const totalDistance = trip._sum.actualDistance ?? 0;

    if (totalFuel === 0) {
      throw new BadRequestException(
        'Fuel efficiency cannot be calculated because no fuel logs exist.',
      );
    }

    return {
      vehicleId,
      totalDistance,
      totalFuel,
      fuelEfficiency: totalDistance / totalFuel,
    };
  }

  async getDashboardCounts() {
    const [fuelLogs, expenses] = await Promise.all([
      this.prisma.fuelLog.count(),
      this.prisma.expense.count(),
    ]);

    return {
      fuelLogs,
      expenses,
    };
  }
}
