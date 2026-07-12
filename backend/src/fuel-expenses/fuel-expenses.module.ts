import { Module } from '@nestjs/common';

import { FuelExpensesController } from './fuel-expenses.controller';
import { FuelExpensesService } from './fuel-expenses.service';

@Module({
  controllers: [FuelExpensesController],
  providers: [FuelExpensesService],
  exports: [FuelExpensesService],
})
export class FuelExpensesModule {}
