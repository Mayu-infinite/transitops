import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(query: DashboardQueryDto) {
    const { vehicleType, status } = query;

    // NOTE: 'region' was requested as a filter, but it doesn't exist on the 
    // Vehicle model in schema.prisma, so it's ignored here.
    
    const vehicleWhere = {
      ...(vehicleType && { type: vehicleType }),
      ...(status && { status }),
    };

    // Use Promise.all to run count queries in parallel
    const [
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      vehiclesOnTrip,
    ] = await Promise.all([
      this.prisma.vehicle.count({
        where: { ...vehicleWhere, status: { not: 'RETIRED' } },
      }),
      this.prisma.vehicle.count({
        where: { ...vehicleWhere, status: 'AVAILABLE' },
      }),
      this.prisma.vehicle.count({
        where: { ...vehicleWhere, status: 'IN_SHOP' },
      }),
      this.prisma.trip.count({
        where: { status: 'DISPATCHED' },
      }),
      this.prisma.trip.count({
        where: { status: 'DRAFT' },
      }),
      this.prisma.driver.count({
        where: { status: 'ON_TRIP' },
      }),
      this.prisma.vehicle.count({
        where: { ...vehicleWhere, status: 'ON_TRIP' },
      }),
    ]);

    const fleetUtilizationPct =
      activeVehicles > 0
        ? Number(((vehiclesOnTrip / activeVehicles) * 100).toFixed(1))
        : 0;

    return {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilizationPct,
    };
  }

  async getAnalytics() {
    // 1. Fleet Utilization (ON_TRIP / Non-Retired)
    const [onTripCount, nonRetiredCount] = await Promise.all([
      this.prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
      this.prisma.vehicle.count({ where: { status: { not: 'RETIRED' } } }),
    ]);
    const fleetUtilizationPct =
      nonRetiredCount > 0
        ? Number(((onTripCount / nonRetiredCount) * 100).toFixed(1))
        : 0;

    // 2. Fuel Efficiency (Sum Completed Trip Distance / Sum Fuel Liters)
    const [distAgg, litersAgg] = await Promise.all([
      this.prisma.trip.aggregate({
        _sum: { actualDistance: true, plannedDistance: true },
        where: { status: 'COMPLETED' },
      }),
      this.prisma.fuelLog.aggregate({ _sum: { liters: true } }),
    ]);
    const totalDist = Number(
      distAgg._sum.actualDistance || distAgg._sum.plannedDistance || 0,
    );
    const totalLiters = Number(litersAgg._sum.liters || 0);
    const fuelEfficiencyKmPerL = totalLiters > 0 ? totalDist / totalLiters : 0;

    // 3. Operational Cost (Fuel + Maint + Expenses)
    const [fuelCostAgg, maintCostAgg, expCostAgg] = await Promise.all([
      this.prisma.fuelLog.aggregate({ _sum: { cost: true } }),
      this.prisma.maintenance.aggregate({ _sum: { cost: true } }),
      this.prisma.expense.aggregate({ _sum: { amount: true } }),
    ]);
    const totalOperationalCost =
      Number(fuelCostAgg._sum.cost || 0) +
      Number(maintCostAgg._sum.cost || 0) +
      Number(expCostAgg._sum.amount || 0);

    // 4. Average Vehicle ROI & Top Costliest Vehicles
    const [tripsRev, maintCosts, fuelCosts, expCosts, vehicles] = await Promise.all([
        this.prisma.trip.groupBy({
          by: ['vehicleId'],
          _sum: { revenue: true },
          where: { status: 'COMPLETED' },
        }),
      this.prisma.maintenance.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
      this.prisma.fuelLog.groupBy({ by: ['vehicleId'], _sum: { cost: true } }),
        this.prisma.expense.groupBy({
          by: ['vehicleId'],
          _sum: { amount: true },
        }),
        this.prisma.vehicle.findMany({
          select: { id: true, registrationNumber: true, acquisitionCost: true },
        }),
    ]);

    // Fast mapping dictionaries for O(1) lookups
    const toMap = (arr: any[], key: string, valKey: string) =>
      new Map(
        arr.map((item) => [item.vehicleId, Number(item._sum[valKey] || 0)]),
      );

    const revMap = toMap(tripsRev, 'vehicleId', 'revenue');
    const maintMap = toMap(maintCosts, 'vehicleId', 'cost');
    const fuelMap = toMap(fuelCosts, 'vehicleId', 'cost');
    const expMap = toMap(expCosts, 'vehicleId', 'amount');

    let totalROI = 0;
    let vehiclesWithCompletedTrips = 0;
    const vehicleCostList: { vehicleId: string; regNo: string; totalCost: number }[] = [];

    for (const v of vehicles) {
      const vRev = revMap.get(v.id) || 0;
      const vMaint = maintMap.get(v.id) || 0;
      const vFuel = fuelMap.get(v.id) || 0;
      const vExp = expMap.get(v.id) || 0;
      
      const totalCost = vMaint + vFuel + vExp;

      vehicleCostList.push({
        vehicleId: v.id,
        regNo: v.registrationNumber,
        totalCost,
      });

      if (vRev > 0 || tripsRev.find((t) => t.vehicleId === v.id)) {
        const acqCost = Number(v.acquisitionCost || 1);
        const roi = (vRev - totalCost) / (acqCost === 0 ? 1 : acqCost);
        totalROI += roi;
        vehiclesWithCompletedTrips++;
      }
    }

    const averageVehicleROI = vehiclesWithCompletedTrips > 0 ? totalROI / vehiclesWithCompletedTrips : 0;

    vehicleCostList.sort((a, b) => b.totalCost - a.totalCost);
    const topCostliestVehicles = vehicleCostList.slice(0, 5);

    // 5. Monthly Revenue (using aggregate over completed trips instead of memory map)
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().substring(0, 7); // YYYY-MM
      
      // We can fallback to fetching trips for exact month range using aggregate
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const monthRevAgg = await this.prisma.trip.aggregate({
        _sum: { revenue: true },
        where: {
          status: 'COMPLETED',
          completedAt: { gte: startOfMonth, lte: endOfMonth },
        },
      });
      monthlyRevenue.push({ month: monthStr, revenue: Number(monthRevAgg._sum.revenue || 0) });
    }

    return {
      fuelEfficiencyKmPerL,
      fleetUtilizationPct,
      totalOperationalCost,
      averageVehicleROI,
      monthlyRevenue,
      topCostliestVehicles,
    };
  }

  async exportCompletedTrips(): Promise<string> {
    const trips = await this.prisma.trip.findMany({
      where: { status: 'COMPLETED' },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    const header = [
      'tripId',
      'source',
      'destination',
      'vehicleRegNo',
      'driverName',
      'cargoWeightKg',
      'distance',
      'fuelConsumed',
      'dispatchedAt',
      'completedAt',
    ];

    const rows = trips.map((t) => {
      // NOTE: No fuelConsumed on Trip model, returning 0
      return [
        t.id,
        `"${t.source.replace(/"/g, '""')}"`,
        `"${t.destination.replace(/"/g, '""')}"`,
        t.vehicle.registrationNumber,
        `"${t.driver.name.replace(/"/g, '""')}"`,
        t.cargoWeight,
        t.actualDistance || t.plannedDistance,
        0, 
        t.dispatchedAt ? t.dispatchedAt.toISOString() : '',
        t.completedAt ? t.completedAt.toISOString() : '',
      ].join(',');
    });

    return [header.join(','), ...rows].join('\n');
  }
}
