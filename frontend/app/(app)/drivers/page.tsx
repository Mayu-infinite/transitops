"use client";
// ─────────────────────────────────────────────────────────────────────────
// Screen 3 · Drivers & Safety Profiles          OWNER: Saichandana
// Mockup: "3. Drivers & Safety Profiles"
// TODO: Add Driver · table (name, license no, category, expiry, contact, trip
//       compl., safety score, status badge) · status toggle (Available/On Trip/
//       Off Duty/Suspended). Rule: expired license OR Suspended -> blocked from
//       trip assignment.
// ─────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { DriversTable } from "@/components/drivers/drivers-table";
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
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Drivers &amp; Safety Profiles
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage driver profiles and safety records.
          </p>
        </div>

        <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          + Add Driver
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search drivers..."
        className="w-full rounded-lg border px-4 py-2"
      />

      <DriversTable search={search} />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Toggle Status</p>

        <div className="flex flex-wrap gap-3">
          <button className="rounded bg-green-500 px-4 py-2 text-white">
            Available
          </button>

          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            On Trip
          </button>

          <button className="rounded bg-gray-400 px-4 py-2 text-white">
            Off Duty
          </button>

          <button className="rounded bg-orange-500 px-4 py-2 text-white">
            Suspended
          </button>
        </div>

        <p className="text-sm text-orange-600">
          Rule: Expired license or Suspended status → blocked from trip
          assignment.
        </p>
      </div>
    </div>
  );
}