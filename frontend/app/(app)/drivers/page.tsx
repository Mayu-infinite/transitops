"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 3 · Drivers & Safety Profiles          OWNER: Saichandana
// Rule: expired license OR Terminated -> blocked from trip assignment.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
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
  ON_LEAVE: "On Leave",
  TERMINATED: "Terminated",
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
    status: "TERMINATED",
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
    status: "ON_LEAVE",
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
        title="Drivers & Safety Profiles"
        description="Manage driver profiles, licenses, and safety records."
        actions={
          <Button variant="primary" size="sm">
            + Add Driver
          </Button>
        }
      />

      <Card className="mb-5 border border-border/80 bg-surface/95 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <Input
            placeholder="Search name, license no, category..."
            aria-label="Search drivers"
          />
          <Select placeholder="Status">
            <Label>Status</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all">All Statuses</ListBox.Item>
                <ListBox.Item id="AVAILABLE">Available</ListBox.Item>
                <ListBox.Item id="ON_TRIP">On Trip</ListBox.Item>
                <ListBox.Item id="ON_LEAVE">On Leave</ListBox.Item>
                <ListBox.Item id="TERMINATED">Terminated</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Card>

      <DataTable
        columns={columns}
        rows={DRIVERS}
        getRowKey={(row) => row.id}
        emptyMessage="No drivers registered yet."
      />

      <p className="mt-4 text-xs text-muted">
        Rule: an expired license or Terminated status blocks a driver from trip
        assignment.
      </p>
    </div>
  );
}
