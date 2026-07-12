import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, VehicleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create Vehicle
   */
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({
        data: createVehicleDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Vehicle registration number already exists.',
        );
      }

      throw error;
    }
  }

  /**
   * Get All Vehicles
   */
  async findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get Vehicle by Id
   */
  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    return vehicle;
  }

  /**
   * Update Vehicle
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    // Prevent manually changing an In Shop vehicle
    // to Available if maintenance is still active.
    if (updateVehicleDto.status === VehicleStatus.AVAILABLE) {
      const activeMaintenance = await this.prisma.maintenance.findFirst({
        where: {
          vehicleId: id,
          status: 'OPEN',
        },
      });

      if (activeMaintenance) {
        throw new ConflictException(
          'Vehicle has active maintenance and cannot become AVAILABLE.',
        );
      }
    }

    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data: updateVehicleDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Vehicle registration number already exists.',
        );
      }

      throw error;
    }
  }

  /**
   * Retire Vehicle
   */
  async retire(id: string) {
    await this.findOne(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: { status: VehicleStatus.RETIRED },
    });
  }

  /**
   * Vehicles eligible for dispatch
   *
   * Hidden:
   * - IN_SHOP
   * - RETIRED
   * - ON_TRIP
   */
  async findDispatchEligible() {
    return this.prisma.vehicle.findMany({
      where: {
        status: VehicleStatus.AVAILABLE,
      },
      orderBy: {
        registrationNumber: 'asc',
      },
    });
  }

  /**
   * Search Vehicles
   */
  async search(search?: string) {
    if (!search) {
      return this.findAll();
    }

    return this.prisma.vehicle.findMany({
      where: {
        OR: [
          {
            registrationNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            model: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        registrationNumber: 'asc',
      },
    });
  }

  /**
   * Dashboard counts
   */
  async getCounts() {
    const [total, available, onTrip, inShop, retired] = await Promise.all([
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({
        where: {
          status: VehicleStatus.AVAILABLE,
        },
      }),
      this.prisma.vehicle.count({
        where: {
          status: VehicleStatus.ON_TRIP,
        },
      }),
      this.prisma.vehicle.count({
        where: {
          status: VehicleStatus.IN_SHOP,
        },
      }),
      this.prisma.vehicle.count({
        where: {
          status: VehicleStatus.RETIRED,
        },
      }),
    ]);

    return {
      total,
      available,
      onTrip,
      inShop,
      retired,
    };
  }
}
