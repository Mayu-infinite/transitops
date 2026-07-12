"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 3 · Drivers & Safety Profiles          OWNER: Saichandana
// Mockup: "3. Drivers & Safety Profiles"
// TODO: Add Driver · table (name, license no, category, expiry, contact, trip
//       compl., safety score, status badge) · status toggle (Available/On Trip/
//       Off Duty/Suspended). Rule: expired license OR Suspended -> blocked from
//       trip assignment.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DRIVER_STATUS_TONE,
  type Driver,
  type DriverStatus,
} from "@/lib/domain";

const STATUS_LABEL: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

const DRIVERS: Driver[] = [
  {
    id: "1",
    name: "Alex",
    licenseNumber: "DL-MH-9284",
    licenseCategory: "LMV",
    licenseExpiry: "2027-12-03",
    contactNumber: "+91 98765 43210",
    safetyScore: 96,
    status: "AVAILABLE",
  },
  {
    id: "2",
    name: "Zain",
    licenseNumber: "DL-KA-3320",
    licenseCategory: "HMV",
    licenseExpiry: "2026-08-12",
    contactNumber: "+91 99887 77665",
    safetyScore: 87,
    status: "SUSPENDED",
  },
  {
    id: "3",
    name: "Priya",
    licenseNumber: "DL-TN-0311",
    licenseCategory: "LMV",
    licenseExpiry: "2027-09-20",
    contactNumber: "+91 90000 11223",
    safetyScore: 91,
    status: "ON_TRIP",
  },
  {
    id: "4",
    name: "Suresh",
    licenseNumber: "DL-GJ-0045",
    licenseCategory: "HMV",
    licenseExpiry: "2025-01-11",
    contactNumber: "+91 91234 45678",
    safetyScore: 74,
    status: "OFF_DUTY",
  },
];

const columns: Column<Driver>[] = [
  { key: "name", header: "Driver" },
  { key: "licenseNumber", header: "License No." },
  { key: "licenseCategory", header: "Category" },
  { key: "licenseExpiry", header: "Expiry" },
  { key: "contactNumber", header: "Contact" },
  {
    key: "safetyScore",
    header: "Safety",
    align: "right",
    render: (row) => `${row.safetyScore}%`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={DRIVER_STATUS_TONE[row.status]}
        label={STATUS_LABEL[row.status]}
      />
    ),
  },
];

export default function DriversPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Drivers & Safety"
        description="License validity, assignment status, and safety profile tracking."
        actions={<Button variant="primary" size="sm">+ Add Driver</Button>}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        {[
          ["Available", "18", "Ready for assignment"],
          ["On Trip", "07", "Currently dispatched"],
          ["Off Duty", "04", "Unavailable today"],
          ["Blocked", "02", "Expired or suspended"],
        ].map(([label, value, hint]) => (
          <Card key={label} className="border border-border/80 bg-surface/95 p-4">
            <p className="text-xs font-semibold uppercase text-muted">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted">{hint}</p>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} rows={DRIVERS} getRowKey={(row) => row.id} />
      <p className="mt-4 text-xs text-muted">
        Rule: suspended drivers or expired licenses cannot be assigned to trips.
      </p>
    </div>
  );
}
