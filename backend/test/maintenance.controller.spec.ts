import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from '../src/maintenance/maintenance.controller';
import { MaintenanceService } from '../src/maintenance/maintenance.service';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [{ provide: MaintenanceService, useValue: {} }],
    }).compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
