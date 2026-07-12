"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 2 · Vehicle Registry (Fleet)          OWNER: Mayuri
// TODO: wire filters + Add Vehicle modal + live data. Rules: reg number unique;
//       Retired/In Shop hidden from dispatch.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  VEHICLE_STATUS_TONE,
  type Vehicle,
  type VehicleStatus,
} from "@/lib/domain";
import { StatusBadge } from "@/components/ui/status-badge";

const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

const VEHICLES: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "MH-04-VAN-05",
    name: "Urban Van",
    model: "E-Transit",
    type: "VAN",
    maxLoadCapacity: 500,
    odometer: 82400,
    acquisitionCost: 630000,
    status: "AVAILABLE",
  },
  {
    id: "2",
    registrationNumber: "KA-12-TRK-11",
    name: "Heavy Truck",
    model: "BharatBenz",
    type: "TRUCK",
    maxLoadCapacity: 5000,
    odometer: 192000,
    acquisitionCost: 2450000,
    status: "ON_TRIP",
  },
  {
    id: "3",
    registrationNumber: "DL-08-MINI-03",
    name: "Mini Cargo",
    model: "Ashok Dost",
    type: "MINI",
    maxLoadCapacity: 1200,
    odometer: 66000,
    acquisitionCost: 490000,
    status: "IN_SHOP",
  },
  {
    id: "4",
    registrationNumber: "GJ-01-VAN-01",
    name: "Legacy Van",
    model: "Traveller",
    type: "VAN",
    maxLoadCapacity: 750,
    odometer: 244900,
    acquisitionCost: 540000,
    status: "RETIRED",
  },
];

const columns: Column<Vehicle>[] = [
  { key: "registrationNumber", header: "Reg. No." },
  {
    key: "name",
    header: "Name / Model",
    render: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted">{row.model}</p>
      </div>
    ),
  },
  { key: "type", header: "Type" },
  {
    key: "maxLoadCapacity",
    header: "Capacity",
    align: "right",
    render: (row) => `${row.maxLoadCapacity.toLocaleString()} kg`,
  },
  {
    key: "odometer",
    header: "Odometer",
    align: "right",
    render: (row) => row.odometer.toLocaleString(),
  },
  {
    key: "acquisitionCost",
    header: "Acq. Cost",
    align: "right",
    render: (row) => `Rs ${row.acquisitionCost.toLocaleString()}`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={VEHICLE_STATUS_TONE[row.status]}
        label={STATUS_LABEL[row.status]}
      />
    ),
  },
];

export default function VehiclesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Fleet"
        description="Master registry of every vehicle in your fleet."
        actions={<Button variant="primary" size="sm">+ Add Vehicle</Button>}
      />
      <Card className="mb-5 border border-border/80 bg-surface/95 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <Input placeholder="Search reg. no, name, model..." aria-label="Search vehicles" />
          <Select placeholder="Type">
            <Label>Type</Label>
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all">All Types</ListBox.Item>
                <ListBox.Item id="van">Van</ListBox.Item>
                <ListBox.Item id="truck">Truck</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
          <Select placeholder="Status">
            <Label>Status</Label>
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all">All Statuses</ListBox.Item>
                <ListBox.Item id="available">Available</ListBox.Item>
                <ListBox.Item id="on-trip">On Trip</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Card>
      <DataTable
        columns={columns}
        rows={VEHICLES}
        getRowKey={(row) => row.id}
        emptyMessage="No vehicles registered yet."
      />
      <p className="mt-4 text-xs text-muted">
        Rule: Retired and In Shop vehicles are hidden from trip dispatch.
      </p>
    </div>
  );
}
