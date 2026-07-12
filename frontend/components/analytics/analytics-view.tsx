"use client";

// OWNER: Saichandana · Analytics components. TODO: KPI cards, charts, CSV export.

import { Button, Card } from "@heroui/react";
import { StatCard } from "@/components/ui/stat-card";

const BARS = [42, 58, 54, 72, 64, 88, 78];

const COSTS = [
  ["TRK-11", 92, "bg-red-400"],
  ["MINI-03", 54, "bg-amber-500"],
  ["VAN-05", 28, "bg-sky-500"],
];

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="primary" size="sm">
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Fuel Efficiency"
          value="8.4 km/L"
          hint="Distance / Fuel"
          accent
        />
        <StatCard
          label="Fleet Utilization"
          value="81%"
          hint="Vehicles in active use"
        />
        <StatCard
          label="Operational Cost"
          value="₹34,070"
          hint="Fuel + Maintenance"
        />
        <StatCard
          label="Vehicle ROI"
          value="14.2%"
          hint="Revenue adjusted return"
        />
      </div>

      <p className="text-xs text-muted">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/80 bg-surface/95 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Monthly Revenue</h2>
            <span className="text-xs text-muted">Last 7 Months</span>
          </div>

          <div className="mt-8 flex h-48 items-end gap-3">
            {BARS.map((height, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-accent/80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted">M{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-border/80 bg-surface/95 p-5">
          <h2 className="text-sm font-semibold">
            Top Costliest Vehicles
          </h2>

          <div className="mt-6 space-y-5">
            {COSTS.map(([vehicle, width, color]) => (
              <div key={vehicle}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>{vehicle}</span>
                  <span className="font-medium">{width}%</span>
                </div>

                <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-right text-xs text-muted">
            PDF export can be added later.
          </p>
        </Card>
      </div>
    </div>
  );
}
