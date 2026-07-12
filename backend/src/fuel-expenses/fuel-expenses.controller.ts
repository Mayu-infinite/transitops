import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FuelExpensesService } from './fuel-expenses.service';
import { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('Fuel & Expenses')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller()
export class FuelExpensesController {
  constructor(private readonly service: FuelExpensesService) {}

  @Get('fuel-logs')
  @ApiOperation({ summary: 'List fuel logs, optional ?vehicleId= filter' })
  findFuelLogs(@Query('vehicleId') vehicleId?: string) {
    return this.service.findFuelLogs(vehicleId);
  }

  @Post('fuel-logs')
  @Roles('FLEET_MANAGER', 'FINANCIAL_ANALYST')
  @ApiOperation({ summary: 'Log fuel purchase for a vehicle/trip' })
  logFuel(@Body() dto: CreateFuelLogDto) {
    return this.service.createFuelLog(dto);
  }

  @Get('expenses')
  @ApiOperation({
    summary: 'List expenses (tolls/misc), optional ?vehicleId= filter',
  })
  findExpenses(@Query('vehicleId') vehicleId?: string) {
    return this.service.findExpenses(vehicleId);
  }

  @Post('expenses')
  @Roles('FLEET_MANAGER', 'FINANCIAL_ANALYST')
  @ApiOperation({
    summary:
      'Log a toll/misc expense; total = toll + other computed server-side',
  })
  logExpense(@Body() dto: CreateExpenseDto) {
    return this.service.createExpense(dto);
  }
}
