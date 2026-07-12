import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VehiclesService', () => {
  let service: VehiclesService;

  const prismaMock = {
    vehicle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },

    maintenance: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findDispatchEligible', () => {
    it('should return available vehicles', async () => {
      prismaMock.vehicle.findMany.mockResolvedValue([
        {
          id: '1',
          registrationNumber: 'GJ01AB1234',
          status: 'AVAILABLE',
        },
      ]);

      const result = await service.findDispatchEligible();

      expect(prismaMock.vehicle.findMany).toHaveBeenCalled();

      expect(result).toHaveLength(1);

      expect(result[0].status).toBe('AVAILABLE');
    });
  });

  describe('findOne', () => {
    it('should return a vehicle', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue({
        id: '1',
        registrationNumber: 'GJ01AB1234',
      });

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
    });
  });
});
