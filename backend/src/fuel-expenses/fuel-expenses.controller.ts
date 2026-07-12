import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { FuelExpensesService } from './fuel-expenses.service';

import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { UpdateFuelLogDto } from './dto/update-fuel-log.dto';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

import { QueryFuelExpenseDto } from './dto/query-fuel-expense.dto';

@ApiTags('Fuel & Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fuel-expenses')
export class FuelExpensesController {
  constructor(private readonly fuelExpensesService: FuelExpensesService) {}

  // ==========================
  // Fuel Logs
  // ==========================

  @Post('fuel')
  @Roles(Role.FLEET_MANAGER)
  @ApiOperation({
    summary: 'Create fuel log',
  })
  createFuelLog(@Body() dto: CreateFuelLogDto) {
    return this.fuelExpensesService.createFuelLog(dto);
  }

  @Get('fuel')
  @ApiOperation({
    summary: 'List fuel logs',
  })
  findFuelLogs(@Query() query: QueryFuelExpenseDto) {
    return this.fuelExpensesService.findFuelLogs(query);
  }

  @Patch('fuel/:id')
  @Roles(Role.FLEET_MANAGER)
  @ApiOperation({
    summary: 'Update fuel log',
  })
  updateFuelLog(@Param('id') id: string, @Body() dto: UpdateFuelLogDto) {
    return this.fuelExpensesService.updateFuelLog(id, dto);
  }

  // ==========================
  // Expenses
  // ==========================

  @Post('expenses')
  @Roles(Role.FLEET_MANAGER)
  @ApiOperation({
    summary: 'Create expense',
  })
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.fuelExpensesService.createExpense(dto);
  }

  @Get('expenses')
  @ApiOperation({
    summary: 'List expenses',
  })
  findExpenses(@Query() query: QueryFuelExpenseDto) {
    return this.fuelExpensesService.findExpenses(query);
  }

  @Patch('expenses/:id')
  @Roles(Role.FLEET_MANAGER)
  @ApiOperation({
    summary: 'Update expense',
  })
  updateExpense(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.fuelExpensesService.updateExpense(id, dto);
  }

  // ==========================
  // Analytics
  // ==========================

  @Get('vehicle/:vehicleId/operational-cost')
  @ApiOperation({
    summary: 'Get operational cost for a vehicle',
  })
  getOperationalCost(@Param('vehicleId') vehicleId: string) {
    return this.fuelExpensesService.getOperationalCost(vehicleId);
  }

  @Get('vehicle/:vehicleId/fuel-efficiency')
  @ApiOperation({
    summary: 'Get fuel efficiency for a vehicle',
  })
  getFuelEfficiency(@Param('vehicleId') vehicleId: string) {
    return this.fuelExpensesService.getFuelEfficiency(vehicleId);
  }
}
