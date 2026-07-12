"use client";

import { Card, Input, Label, Select, ListBox } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { TRIP_STATUS_TONE, type TripStatus } from "@/lib/domain";

// NOTE: sample data — replace with live analytics once the backend is wired.
const KPIS = [
  { label: "Active Vehicles", value: "53", hint: "Currently tracked", accent: true },
  { label: "Available", value: "42", hint: "Ready to dispatch" },
  { label: "In Maintenance", value: "05", hint: "Vehicles in shop" },
  { label: "Active Trips", value: "18", hint: "In progress" },
  { label: "Pending Trips", value: "09", hint: "Awaiting dispatch" },
  { label: "Fleet Utilization", value: "81%", hint: "Operational health", accent: true },
];

type TripRow = {
  trip: string;
  vehicle: string;
  driver: string;
  status: TripStatus;
  eta: string;
};

const RECENT_TRIPS: TripRow[] = [
  { trip: "TR001", vehicle: "VAN-05", driver: "Alex", status: "DISPATCHED", eta: "45 min" },
  { trip: "TR002", vehicle: "TRK-12", driver: "Joan", status: "COMPLETED", eta: "—" },
  { trip: "TR003", vehicle: "MINI-03", driver: "Priya", status: "DISPATCHED", eta: "1h 10m" },
  { trip: "TR006", vehicle: "—", driver: "—", status: "DRAFT", eta: "Awaiting vehicle" },
];

const FLEET_STATUS = [
  { label: "Available", count: 42, total: 67, className: "bg-emerald-500" },
  { label: "On Trip", count: 18, total: 67, className: "bg-sky-500" },
  { label: "In Shop", count: 5, total: 67, className: "bg-amber-500" },
  { label: "Retired", count: 2, total: 67, className: "bg-red-500" },
];

const STATUS_LABEL: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const columns: Column<TripRow>[] = [
  { key: "trip", header: "Trip" },
  { key: "vehicle", header: "Vehicle" },
  { key: "driver", header: "Driver" },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <StatusBadge tone={TRIP_STATUS_TONE[r.status]} label={STATUS_LABEL[r.status]} />
    ),
  },
  { key: "eta", header: "ETA", align: "right" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? ""}`}
        description={`Signed in as ${
          user ? ROLE_LABELS[user.role as Role] : ""
        } · operational overview for vehicles, trips, and drivers.`}
        actions={
          <span className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
            Live Board
          </span>
        }
      />

      <Card className="mb-5 border border-border/80 bg-surface/95 p-4 shadow-sm shadow-black/5">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <Input placeholder="Search fleet, trips, drivers..." aria-label="Search dashboard" />
          {["Vehicle Type", "Status", "Region"].map((label) => (
            <Select key={label} placeholder={label}>
              <Label>{label}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all">All</ListBox.Item>
                  <ListBox.Item id="priority">Priority</ListBox.Item>
                  <ListBox.Item id="north">North Hub</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {KPIS.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            accent={kpi.accent}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Recent Trips
          </h2>
          <DataTable columns={columns} rows={RECENT_TRIPS} getRowKey={(r) => r.trip} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Fleet Status
          </h2>
          <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
            <ul className="space-y-4">
              {FLEET_STATUS.map((s) => (
                <li key={s.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted">{s.label}</span>
                    <span className="font-medium text-foreground">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className={`h-full rounded-full ${s.className}`}
                      style={{ width: `${(s.count / s.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">
        Showing sample data — figures update once analytics endpoints are connected.
      </p>
    </div>
  );
}
