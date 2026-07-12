import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
