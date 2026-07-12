"use client";

import { useMemo, useState } from "react";
import { Card, Input } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { QueryState } from "@/components/ui/query-state";
import {
  TRIP_STATUS_TONE,
  type Trip,
  type TripStatus,
  type Vehicle,
  type VehicleStatus,
} from "@/lib/domain";
import { listVehicles } from "@/lib/api/vehicles";
import { getTripCounts, listTrips, type TripCounts } from "@/lib/api/trips";
import { useApiData } from "@/lib/use-api";

const STATUS_LABEL: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const FLEET_BARS: { status: VehicleStatus; label: string; className: string }[] = [
  { status: "AVAILABLE", label: "Available", className: "bg-emerald-500" },
  { status: "ON_TRIP", label: "On Trip", className: "bg-sky-500" },
  { status: "IN_SHOP", label: "In Shop", className: "bg-amber-500" },
  { status: "RETIRED", label: "Retired", className: "bg-red-500" },
];

const tripColumns: Column<Trip>[] = [
  { key: "id", header: "Trip", render: (t) => <span className="font-medium">{t.id.slice(0, 8)}</span> },
  { key: "source", header: "Route", render: (t) => `${t.source} → ${t.destination}` },
  {
    key: "status",
    header: "Status",
    render: (t) => <StatusBadge tone={TRIP_STATUS_TONE[t.status]} label={STATUS_LABEL[t.status]} />,
  },
  { key: "plannedDistance", header: "Distance", align: "right", render: (t) => `${t.plannedDistance} km` },
];

interface DashData {
  vehicles: Vehicle[];
  counts: TripCounts;
  trips: Trip[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data, loading, error, reload } = useApiData<DashData>(async () => {
    const [vehicles, counts, trips] = await Promise.all([
      listVehicles(),
      getTripCounts(),
      listTrips().catch(() => [] as Trip[]),
    ]);
    return { vehicles, counts, trips };
  });

  const vehicles = data?.vehicles ?? [];
  const counts = data?.counts;
  const byStatus = (s: VehicleStatus) => vehicles.filter((v) => v.status === s).length;
  const total = vehicles.length;
  const activeFleet = total - byStatus("RETIRED");
  const utilization = activeFleet > 0 ? Math.round((byStatus("ON_TRIP") / activeFleet) * 100) : 0;

  const kpis = [
    { label: "Active Vehicles", value: String(total), hint: "Currently tracked", accent: true },
    { label: "Available", value: String(byStatus("AVAILABLE")), hint: "Ready to dispatch" },
    { label: "In Maintenance", value: String(byStatus("IN_SHOP")), hint: "Vehicles in shop" },
    { label: "Active Trips", value: String(counts?.dispatched ?? 0), hint: "In progress" },
    { label: "Pending Trips", value: String(counts?.draft ?? 0), hint: "Awaiting dispatch" },
    { label: "Fleet Utilization", value: `${utilization}%`, hint: "Operational health", accent: true },
  ];

  const recentTrips = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = data?.trips ?? [];
    const filtered = q
      ? list.filter((t) =>
          [t.id, t.source, t.destination].some((f) => f.toLowerCase().includes(q)),
        )
      : list;
    return filtered.slice(0, 6);
  }, [data, search]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? ""}`}
        description={`Signed in as ${
          user ? ROLE_LABELS[user.role as Role] : ""
        } · operational overview for vehicles, trips, and drivers.`}
        actions={
          <span className="rounded-[6px] bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
            Live Board
          </span>
        }
      />

      <Card className="mb-5 border border-border/80 bg-surface/95 p-4 shadow-sm shadow-black/5">
        <Input
          placeholder="Search recent trips by id or route..."
          aria-label="Search dashboard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <QueryState loading={loading} error={error} onRetry={reload}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi) => (
            <StatCard key={kpi.label} label={kpi.label} value={kpi.value} hint={kpi.hint} accent={kpi.accent} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Trips</h2>
            <DataTable
              columns={tripColumns}
              rows={recentTrips}
              getRowKey={(t) => t.id}
              emptyMessage="No trips yet. Create one from the Trips screen."
            />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Fleet Status</h2>
            <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
              <ul className="space-y-4">
                {FLEET_BARS.map((s) => {
                  const count = byStatus(s.status);
                  return (
                    <li key={s.status}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted">{s.label}</span>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-sm bg-surface-secondary">
                        <div
                          className={`h-full rounded-sm ${s.className}`}
                          style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              {total === 0 ? (
                <p className="mt-4 text-xs text-muted">No vehicles registered yet.</p>
              ) : null}
            </Card>
          </div>
        </div>
      </QueryState>
    </div>
  );
}
