import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriverStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register Driver
   */
  async create(createDriverDto: CreateDriverDto) {
    try {
      return await this.prisma.driver.create({
        data: createDriverDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('License number already exists.');
      }

      throw error;
    }
  }

  /**
   * List Drivers
   */
  async findAll(query: QueryDriverDto) {
    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.DriverWhereInput = {
      ...(status && { status }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            licenseNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const [drivers, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.driver.count({
        where,
      }),
    ]);

    return {
      data: drivers,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Driver Details
   */
  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: {
        id,
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found.');
    }

    return driver;
  }

  /**
   * Update Driver
   */
  async update(id: string, updateDriverDto: UpdateDriverDto) {
    await this.findOne(id);

    try {
      return await this.prisma.driver.update({
        where: {
          id,
        },
        data: updateDriverDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('License number already exists.');
      }

      throw error;
    }
  }

  /**
   * Drivers eligible for dispatch
   *
   * Rules:
   * - AVAILABLE
   * - License not expired
   */
  async findDispatchEligible() {
    return await this.prisma.driver.findMany({
      where: {
        status: DriverStatus.AVAILABLE,

        licenseExpiry: {
          gte: new Date(),
        },
      },

      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Drivers whose licenses
   * expire within X days.
   */
  async findExpiringLicenses(days = 7) {
    const today = new Date();

    const expiry = new Date();

    expiry.setDate(today.getDate() + days);

    return await this.prisma.driver.findMany({
      where: {
        licenseExpiry: {
          gte: today,
          lte: expiry,
        },
      },

      orderBy: {
        licenseExpiry: 'asc',
      },
    });
  }

  /**
   * Dashboard counts
   */
  async getCounts() {
    const grouped = await this.prisma.driver.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const result = {
      total: 0,
      available: 0,
      onTrip: 0,
      onLeave: 0,
      terminated: 0,
    };

    grouped.forEach((g) => {
      const count = g._count.status;
      result.total += count;
      if (g.status === DriverStatus.AVAILABLE) result.available = count;
      if (g.status === DriverStatus.ON_TRIP) result.onTrip = count;
      if (g.status === DriverStatus.OFF_DUTY) result.onLeave = count;
      if (g.status === DriverStatus.SUSPENDED) result.terminated = count;
    });

    return result;
  }
}
