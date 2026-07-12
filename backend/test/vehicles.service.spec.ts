import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from '../src/vehicles/vehicles.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
