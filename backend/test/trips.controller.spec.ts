import { Test, type TestingModule } from '@nestjs/testing';
import { TripsController } from '../src/trips/trips.controller';
import { TripsService } from '../src/trips/trips.service';

describe('TripsController', () => {
  let controller: TripsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [{ provide: TripsService, useValue: {} }],
    }).compile();

    controller = module.get<TripsController>(TripsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
