"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 7 · Reports & Analytics                OWNER: Saichandana
// Mockup: "7. Reports & Analytics"
// TODO: KPI cards (Fuel Efficiency, Fleet Utilization, Operational Cost,
//       Vehicle ROI) · Monthly Revenue chart · Top Costliest Vehicles ·
//       CSV export (PDF optional). ROI = (Revenue - (Maint + Fuel)) / AcqCost.
// ─────────────────────────────────────────────────────────────────────────

import { Button, Card } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

const BARS = [42, 58, 54, 72, 64, 88, 78];

const COSTS = [
  ["TRK-11", 92, "bg-red-400"],
  ["MINI-03", 54, "bg-amber-500"],
  ["VAN-05", 28, "bg-sky-500"],
];

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports & Analytics"
        description="Fuel efficiency, utilization, cost, and ROI insights."
        actions={
          <Button variant="primary" size="sm">
            Export CSV
          </Button>
        }
      />

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

      <p className="mt-3 text-xs text-muted">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/80 bg-surface/95 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Monthly Revenue
            </h2>
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
          <h2 className="text-sm font-semibold text-foreground">
            Top Costliest Vehicles
          </h2>

          <div className="mt-6 space-y-5">
            {COSTS.map(([vehicle, width, color]) => (
              <div key={vehicle}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted">{vehicle}</span>
                  <span className="font-medium">{width}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
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