import { Test, type TestingModule } from '@nestjs/testing';
import { DriversController } from '../src/drivers/drivers.controller';
import { DriversService } from '../src/drivers/drivers.service';

describe('DriversController', () => {
  let controller: DriversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [{ provide: DriversService, useValue: {} }],
    }).compile();

    controller = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
