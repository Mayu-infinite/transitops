import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MaintenanceStatus,
  Prisma,
  VehicleStatus,
} from '@prisma/client';

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
  async openMaintenance(
    createMaintenanceDto: CreateMaintenanceDto,
  ) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: createMaintenanceDto.vehicleId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new ConflictException(
        'Vehicle is currently on a trip.',
      );
    }

    if (vehicle.status === VehicleStatus.RETIRED) {
      throw new ConflictException(
        'Retired vehicles cannot enter maintenance.',
      );
    }

    const activeMaintenance =
      await this.prisma.maintenance.findFirst({
        where: {
          vehicleId: vehicle.id,
          status: MaintenanceStatus.OPEN,
        },
      });

    if (activeMaintenance) {
      throw new ConflictException(
        'Vehicle already has an active maintenance record.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const maintenance =
        await tx.maintenance.create({
          data: createMaintenanceDto,
        });

      await tx.vehicle.update({
        where: {
          id: vehicle.id,
        },
        data: {
          status: VehicleStatus.IN_SHOP,
        },
      });

      return maintenance;
    });
  }

  /**
   * List Maintenance Records
   */
  async findAll(query: QueryMaintenanceDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      vehicleId,
    } = query;

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
    const maintenance =
      await this.prisma.maintenance.findUnique({
        where: {
          id,
        },

        include: {
          vehicle: true,
        },
      });

    if (!maintenance) {
      throw new NotFoundException(
        'Maintenance record not found.',
      );
    }

    return maintenance;
  }

  /**
   * Update Maintenance Record
   */
  async update(
    id: string,
    updateMaintenanceDto: UpdateMaintenanceDto,
  ) {
    await this.findOne(id);

    try {
      return await this.prisma.maintenance.update({
        where: {
          id,
        },

        data: updateMaintenanceDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new BadRequestException(
          error.message,
        );
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
      throw new NotFoundException(
        'Maintenance record not found.',
      );
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new ConflictException(
        'Maintenance is already completed.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedMaintenance =
        await tx.maintenance.update({
          where: {
            id,
          },
          data: {
            status: MaintenanceStatus.COMPLETED,
            endDate: new Date(),
          },
        });

      if (
        maintenance.vehicle.status !==
        VehicleStatus.RETIRED
      ) {
        await tx.vehicle.update({
          where: {
            id: maintenance.vehicleId,
          },
          data: {
            status: VehicleStatus.AVAILABLE,
          },
        });
      }

      return updatedMaintenance;
    });
  }

  /**
   * Dashboard Statistics
   */
  async getCounts() {
    const [
      total,
      open,
      completed,
    ] = await Promise.all([
      this.prisma.maintenance.count(),

      this.prisma.maintenance.count({
        where: {
          status: MaintenanceStatus.OPEN,
        },
      }),

      this.prisma.maintenance.count({
        where: {
          status: MaintenanceStatus.COMPLETED,
        },
      }),
    ]);

    return {
      total,
      open,
      completed,
    };
  }

  /**
   * Active Maintenance Records
   */
  async getOpenMaintenance() {
    return this.prisma.maintenance.findMany({
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
    return this.prisma.maintenance.findMany({
      where: {
        vehicleId,
      },

      orderBy: {
        startDate: 'desc',
      },
    });
  }
}