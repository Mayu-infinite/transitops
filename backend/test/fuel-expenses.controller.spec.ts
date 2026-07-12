import { Test, type TestingModule } from '@nestjs/testing';
import { FuelExpensesController } from '../src/fuel-expenses/fuel-expenses.controller';
import { FuelExpensesService } from '../src/fuel-expenses/fuel-expenses.service';

describe('FuelExpensesController', () => {
  let controller: FuelExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelExpensesController],
      providers: [{ provide: FuelExpensesService, useValue: {} }],
    }).compile();

    controller = module.get<FuelExpensesController>(FuelExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
