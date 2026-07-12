import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto, CompleteTripDto } from './dto/update-trip.dto';
import { QueryTripDto } from './dto/query-trip.dto';
import { Prisma, TripStatus, VehicleStatus, DriverStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CREATE
  // ==========================================
  async create(dto: CreateTripDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    const driver = await this.prisma.driver.findUnique({
      where: { id: dto.driverId },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found.');
    }

    if (dto.cargoWeight > vehicle.maxLoadCapacity) {
      throw new BadRequestException('Cargo weight exceeds vehicle max load capacity.');
    }

    return this.prisma.trip.create({
      data: {
        ...dto,
        status: TripStatus.DRAFT,
      } as Prisma.TripUncheckedCreateInput,
    });
  }

  // ==========================================
  // FIND
  // ==========================================
  async findAll(query: QueryTripDto) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { source: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { vehicle: { registrationNumber: { contains: search, mode: 'insensitive' } } },
        { driver: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true, driver: true },
      }),
      this.prisma.trip.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }
    return trip;
  }

  // ==========================================
  // UPDATE
  // ==========================================
  async update(id: string, dto: UpdateTripDto) {
    await this.findOne(id);
    return this.prisma.trip.update({
      where: { id },
      data: dto,
    });
  }

  // ==========================================
  // DISPATCH
  // ==========================================
  async dispatch(id: string) {
    const trip = await this.findOne(id);

    if (trip.status !== TripStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT trips can be dispatched.');
    }

    const vehicle = trip.vehicle;
    const driver = trip.driver;

    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new ConflictException('Vehicle is not AVAILABLE.');
    }

    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new ConflictException('Driver is not AVAILABLE.');
    }

    // License expiry validation
    if (driver.licenseExpiry && driver.licenseExpiry < new Date()) {
      throw new ConflictException('Driver license has expired.');
    }

    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      throw new ConflictException('Cargo weight exceeds vehicle max load capacity.');
    }

    return this.prisma.$transaction([
      this.prisma.trip.update({
        where: { id },
        data: {
          status: TripStatus.DISPATCHED,
          dispatchedAt: new Date(),
        },
      }),
      this.prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.ON_TRIP },
      }),
      this.prisma.driver.update({
        where: { id: driver.id },
        data: { status: DriverStatus.ON_TRIP },
      }),
    ]);
  }

  // ==========================================
  // COMPLETE
  // ==========================================
  async complete(id: string, dto: CompleteTripDto) {
    const trip = await this.findOne(id);

    if (trip.status !== TripStatus.DISPATCHED) {
      throw new BadRequestException('Only DISPATCHED trips can be completed.');
    }

    return this.prisma.$transaction([
      this.prisma.trip.update({
        where: { id },
        data: {
          status: TripStatus.COMPLETED,
          actualDistance: dto.actualDistance,
          completedAt: new Date(),
        },
      }),
      this.prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: VehicleStatus.AVAILABLE,
          odometer: dto.finalOdometer,
        },
      }),
      this.prisma.driver.update({
        where: { id: trip.driverId },
        data: {
          status: DriverStatus.AVAILABLE,
        },
      }),
    ]);
  }

  // ==========================================
  // CANCEL
  // ==========================================
  async cancel(id: string) {
    const trip = await this.findOne(id);

    if (trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELLED) {
      throw new BadRequestException('Trip is already completed or cancelled.');
    }

    const updates: any[] = [
      this.prisma.trip.update({
        where: { id },
        data: { status: TripStatus.CANCELLED },
      }),
    ];

    if (trip.status === TripStatus.DISPATCHED) {
      updates.push(
        this.prisma.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        })
      );
      updates.push(
        this.prisma.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.AVAILABLE },
        })
      );
    }

    return this.prisma.$transaction(updates);
  }

  // ==========================================
  // DASHBOARD & HELPERS
  // ==========================================
  async getCounts() {
    const [total, draft, dispatched, completed, cancelled] = await Promise.all([
      this.prisma.trip.count(),
      this.prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      this.prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
      this.prisma.trip.count({ where: { status: TripStatus.COMPLETED } }),
      this.prisma.trip.count({ where: { status: TripStatus.CANCELLED } }),
    ]);

    return { total, draft, dispatched, completed, cancelled };
  }

  async getActiveTrips() {
    return this.prisma.trip.findMany({
      where: { status: TripStatus.DISPATCHED },
      include: { vehicle: true, driver: true },
      orderBy: { dispatchedAt: 'desc' },
    });
  }

  async findPendingTrips() {
    return this.prisma.trip.findMany({
      where: { status: TripStatus.DRAFT },
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
