import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaintenanceStatus, Prisma, VehicleStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { QueryMaintenanceDto } from './dto/query-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Open Maintenance
   *
   * Business Rules:
   * - Vehicle must exist
   * - Vehicle cannot be ON_TRIP
   * - Vehicle cannot already have OPEN maintenance
   * - Vehicle status becomes IN_SHOP
   */
  async openMaintenance(createMaintenanceDto: CreateMaintenanceDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: createMaintenanceDto.vehicleId },
      include: {
        maintenances: {
          where: { status: MaintenanceStatus.OPEN },
          take: 1,
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new ConflictException('Vehicle is currently on a trip.');
    }

    if (vehicle.status === VehicleStatus.RETIRED) {
      throw new ConflictException('Retired vehicles cannot enter maintenance.');
    }

    if (vehicle.maintenances.length > 0) {
      throw new ConflictException(
        'Vehicle already has an active maintenance record.',
      );
    }

    const [maintenance] = await this.prisma.$transaction([
      this.prisma.maintenance.create({ data: createMaintenanceDto }),
      this.prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.IN_SHOP },
      }),
    ]);

    return maintenance;
  }

  /**
   * List Maintenance Records
   */
  async findAll(query: QueryMaintenanceDto) {
    const { page = 1, limit = 10, search, status, vehicleId } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.MaintenanceWhereInput = {
      ...(status && { status }),

      ...(vehicleId && { vehicleId }),

      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [records, total] = await Promise.all([
      this.prisma.maintenance.findMany({
        where,

        include: {
          vehicle: true,
        },

        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.maintenance.count({
        where,
      }),
    ]);

    return {
      data: records,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get Maintenance Record
   */
  async findOne(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: {
        id,
      },

      include: {
        vehicle: true,
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found.');
    }

    return maintenance;
  }

  /**
   * Update Maintenance Record
   */
  async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    await this.findOne(id);

    try {
      return await this.prisma.maintenance.update({
        where: {
          id,
        },

        data: updateMaintenanceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  /**
   * Close Maintenance
   *
   * Business Rules:
   * - Maintenance must exist
   * - Maintenance must be OPEN
   * - Vehicle becomes AVAILABLE
   * - Unless vehicle is RETIRED
   */
  async closeMaintenance(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: {
        id,
      },
      include: {
        vehicle: true,
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found.');
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new ConflictException('Maintenance is already completed.');
    }

    const updates: any[] = [
      this.prisma.maintenance.update({
        where: { id },
        data: {
          status: MaintenanceStatus.COMPLETED,
          endDate: new Date(),
        },
      }),
    ];

    if (maintenance.vehicle.status !== VehicleStatus.RETIRED) {
      updates.push(
        this.prisma.vehicle.update({
          where: { id: maintenance.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        }),
      );
    }

    const [updatedMaintenance] = await this.prisma.$transaction(updates);
    return updatedMaintenance;
  }

  /**
   * Dashboard Statistics
   */
  async getCounts() {
    const grouped = await this.prisma.maintenance.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const result = { total: 0, open: 0, completed: 0 };

    grouped.forEach((g) => {
      const count = g._count.status;
      result.total += count;
      if (g.status === MaintenanceStatus.OPEN) result.open = count;
      if (g.status === MaintenanceStatus.COMPLETED) result.completed = count;
    });

    return result;
  }

  /**
   * Active Maintenance Records
   */
  async getOpenMaintenance() {
    return await this.prisma.maintenance.findMany({
      where: {
        status: MaintenanceStatus.OPEN,
      },

      include: {
        vehicle: {
          select: {
            id: true,
            registrationNumber: true,
            name: true,
            status: true,
          },
        },
      },

      orderBy: {
        startDate: 'asc',
      },
    });
  }

  /**
   * Maintenance History
   */
  async getHistory(vehicleId: string) {
    return await this.prisma.maintenance.findMany({
      where: {
        vehicleId,
      },

      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
