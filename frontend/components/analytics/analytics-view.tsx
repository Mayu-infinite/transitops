"use client";

// OWNER: Saichandana · Analytics — live KPIs, cost breakdown, costliest vehicles,
// CSV export. All figures are computed from real vehicle / fuel / expense /
// maintenance data.

import { useMemo } from "react";
import { Button, Card } from "@heroui/react";
import { StatCard } from "@/components/ui/stat-card";
import { QueryState } from "@/components/ui/query-state";
import { listVehicles } from "@/lib/api/vehicles";
import { listFuelLogs, listExpenses } from "@/lib/api/finance";
import { listMaintenance } from "@/lib/api/maintenance";
import { getTripCounts, type TripCounts } from "@/lib/api/trips";
import { useApiData } from "@/lib/use-api";
import { inr } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import type { Expense, FuelLog, MaintenanceRecord, Vehicle } from "@/lib/domain";

interface AnalyticsData {
  vehicles: Vehicle[];
  fuel: FuelLog[];
  expenses: Expense[];
  maintenance: MaintenanceRecord[];
  counts: TripCounts;
}

const BAR_COLORS = ["bg-red-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500", "bg-violet-500"];

export function AnalyticsView() {
  const { data, loading, error, reload } = useApiData<AnalyticsData>(async () => {
    const [vehicles, fuel, expenses, maintenance, counts] = await Promise.all([
      listVehicles(),
      listFuelLogs(),
      listExpenses(),
      listMaintenance().catch(() => [] as MaintenanceRecord[]),
      getTripCounts(),
    ]);
    return { vehicles, fuel, expenses, maintenance, counts };
  });

  const model = useMemo(() => {
    const vehicles = data?.vehicles ?? [];
    const fuel = data?.fuel ?? [];
    const expenses = data?.expenses ?? [];
    const maintenance = data?.maintenance ?? [];

    const totalFuel = fuel.reduce((s, r) => s + r.cost, 0);
    const totalExpense = expenses.reduce((s, r) => s + r.amount, 0);
    const totalMaint = maintenance.reduce((s, r) => s + r.cost, 0);
    const operationalCost = totalFuel + totalExpense + totalMaint;

    const active = vehicles.filter((v) => v.status !== "RETIRED").length;
    const onTrip = vehicles.filter((v) => v.status === "ON_TRIP").length;
    const utilization = active > 0 ? Math.round((onTrip / active) * 100) : 0;

    // Per-vehicle total spend.
    const reg = new Map(vehicles.map((v) => [v.id, v.registrationNumber]));
    const perVehicle = new Map<string, number>();
    const add = (id: string, amt: number) => perVehicle.set(id, (perVehicle.get(id) ?? 0) + amt);
    fuel.forEach((r) => add(r.vehicleId, r.cost));
    expenses.forEach((r) => add(r.vehicleId, r.amount));
    maintenance.forEach((r) => add(r.vehicleId, r.cost));
    const costliest = [...perVehicle.entries()]
      .map(([id, cost]) => ({ vehicle: reg.get(id) ?? id.slice(0, 8), cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    return {
      totalFuel,
      totalExpense,
      totalMaint,
      operationalCost,
      utilization,
      fleetSize: vehicles.length,
      costliest,
    };
  }, [data]);

  const breakdown = [
    { label: "Fuel", value: model.totalFuel },
    { label: "Expenses", value: model.totalExpense },
    { label: "Maintenance", value: model.totalMaint },
  ];
  const breakdownMax = Math.max(1, ...breakdown.map((b) => b.value));
  const costMax = Math.max(1, ...model.costliest.map((c) => c.cost));

  const exportCsv = () => {
    downloadCsv(
      "transitops-vehicle-costs",
      ["Vehicle", "Total Cost (INR)"],
      model.costliest.map((c) => [c.vehicle, c.cost]),
    );
  };

  return (
    <QueryState loading={loading} error={error} onRetry={reload}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onPress={exportCsv}>
            Export CSV
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Operational Cost" value={inr(model.operationalCost)} hint="Fuel + Expenses + Maint." accent />
          <StatCard label="Fleet Utilization" value={`${model.utilization}%`} hint="Vehicles on trip" />
          <StatCard label="Total Fuel Cost" value={inr(model.totalFuel)} hint="All logged fuel" />
          <StatCard label="Fleet Size" value={String(model.fleetSize)} hint="Registered vehicles" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cost breakdown */}
          <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
            <h2 className="text-sm font-semibold text-foreground">Cost Breakdown</h2>
            <p className="mt-1 text-xs text-muted">Where operational spend goes</p>
            <div className="mt-6 space-y-5">
              {breakdown.map((b, i) => (
                <div key={b.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{b.label}</span>
                    <span className="text-muted">{inr(b.value)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-sm bg-surface-secondary">
                    <div
                      className={`h-full rounded-sm ${BAR_COLORS[i]}`}
                      style={{ width: `${(b.value / breakdownMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Costliest vehicles */}
          <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
            <h2 className="text-sm font-semibold text-foreground">Top Costliest Vehicles</h2>
            <p className="mt-1 text-xs text-muted">By total operational spend</p>
            <div className="mt-6 space-y-5">
              {model.costliest.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">No cost data yet.</p>
              ) : (
                model.costliest.map((c, i) => (
                  <div key={c.vehicle}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.vehicle}</span>
                      <span className="text-muted">{inr(c.cost)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-sm bg-surface-secondary">
                      <div
                        className={`h-full rounded-sm ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{ width: `${(c.cost / costMax) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </QueryState>
  );
}
