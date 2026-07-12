import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DriverStatus,
  Prisma,
} from '@prisma/client';

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
        throw new ConflictException(
          'License number already exists.',
        );
      }

      throw error;
    }
  }

  /**
   * List Drivers
   */
  async findAll(query: QueryDriverDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

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
      throw new NotFoundException(
        'Driver not found.',
      );
    }

    return driver;
  }

  /**
   * Update Driver
   */
  async update(
    id: string,
    updateDriverDto: UpdateDriverDto,
  ) {
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
        throw new ConflictException(
          'License number already exists.',
        );
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
    return this.prisma.driver.findMany({
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

    return this.prisma.driver.findMany({
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
    const [
      total,
      available,
      onTrip,
      offDuty,
      suspended,
    ] = await Promise.all([
      this.prisma.driver.count(),

      this.prisma.driver.count({
        where: {
          status: DriverStatus.AVAILABLE,
        },
      }),

      this.prisma.driver.count({
        where: {
          status: DriverStatus.ON_TRIP,
        },
      }),

      this.prisma.driver.count({
        where: {
          status: DriverStatus.OFF_DUTY,
        },
      }),

      this.prisma.driver.count({
        where: {
          status: DriverStatus.SUSPENDED,
        },
      }),
    ]);

    return {
      total,
      available,
      onTrip,
      offDuty,
      suspended,
    };
  }
}