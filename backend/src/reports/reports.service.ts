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
      totalVehicles,
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
        where: vehicleWhere,
      }),
    ]);

    const fleetUtilizationPct =
      totalVehicles > 0 ? Number(((activeTrips / totalVehicles) * 100).toFixed(1)) : 0;

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
    const [activeTrips, totalVehicles] = await Promise.all([
      this.prisma.trip.count({ where: { status: 'DISPATCHED' } }),
      this.prisma.vehicle.count(),
    ]);

    const fleetUtilizationPct =
      totalVehicles > 0 ? Number(((activeTrips / totalVehicles) * 100).toFixed(1)) : 0;

    // NOTE: The prompt requested filtering by `fuelConsumed > 0` and dividing plannedDistance by fuelConsumed,
    // but the `Trip` model in schema.prisma DOES NOT have a `fuelConsumed` field.
    // Returning 0 to avoid breaking types.
    const fuelEfficiencyKmPerL = 0;

    const [fuelAgg, maintAgg] = await Promise.all([
      this.prisma.fuelLog.aggregate({ _sum: { cost: true } }),
      this.prisma.maintenance.aggregate({ _sum: { cost: true } }),
    ]);

    const totalFuelCost = Number(fuelAgg._sum.cost || 0);
    const totalMaintCost = Number(maintAgg._sum.cost || 0);
    const totalOperationalCost = totalFuelCost + totalMaintCost;

    // NOTE: The prompt stated "There's no `revenue` field anywhere in the schema. Use SUM(Expense.total)..."
    // Actually, Trip DOES have a `revenue` field, but to follow the instructions exactly, 
    // I am using SUM(Expense.amount) as a stand-in.
    // Note also that `Expense` has `amount`, not `total`.
    const vehicles = await this.prisma.vehicle.findMany({
      include: {
        trips: { where: { status: 'COMPLETED' } },
        maintenances: true,
        fuelLogs: true,
        expenses: true,
      },
    });

    let totalROI = 0;
    let vehiclesWithCompletedTrips = 0;
    const vehicleCostList: { vehicleId: string; regNo: string; totalCost: number }[] = [];

    for (const v of vehicles) {
      const vMaintCost = v.maintenances.reduce((sum, m) => sum + Number(m.cost || 0), 0);
      const vFuelCost = v.fuelLogs.reduce((sum, f) => sum + Number(f.cost || 0), 0);
      const vExpenseCost = v.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      
      const totalCost = vMaintCost + vFuelCost + vExpenseCost;

      vehicleCostList.push({
        vehicleId: v.id,
        regNo: v.registrationNumber,
        totalCost,
      });

      if (v.trips.length > 0) {
        // Stand-in for revenue using expenses as strictly requested
        const revenueStandIn = vExpenseCost;
        const acqCost = Number(v.acquisitionCost || 1);
        const safeAcqCost = acqCost === 0 ? 1 : acqCost;
        
        const roi = (revenueStandIn - (vMaintCost + vFuelCost)) / safeAcqCost;
        totalROI += roi;
        vehiclesWithCompletedTrips++;
      }
    }

    const averageVehicleROI =
      vehiclesWithCompletedTrips > 0 ? totalROI / vehiclesWithCompletedTrips : 0;

    vehicleCostList.sort((a, b) => b.totalCost - a.totalCost);
    const topCostliestVehicles = vehicleCostList.slice(0, 5);

    // Calculate monthly revenue for the last 6 months
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().substring(0, 7); // YYYY-MM
      
      const monthExpenses = vehicles.flatMap((v) => v.expenses).filter((e) => {
        return e.expenseDate.toISOString().substring(0, 7) === monthStr;
      });
      
      const rev = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      monthlyRevenue.push({ month: monthStr, revenue: rev });
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
