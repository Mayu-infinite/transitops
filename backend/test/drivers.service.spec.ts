import { Test, type TestingModule } from '@nestjs/testing';
import { DriversService } from '../src/drivers/drivers.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('DriversService', () => {
  let service: DriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
