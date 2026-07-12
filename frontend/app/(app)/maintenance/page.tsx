"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 5 · Maintenance                        OWNER: Saichandana
// Mockup: "5. Maintenance"
// TODO: Log Service Record form (vehicle, service type, cost, date, status) ·
//       Service Log table. Rule: creating an ACTIVE record -> vehicle In Shop
//       (removed from dispatch pool); closing -> vehicle Available (unless
//       Retired).
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

type ServiceRow = {
  id: string;
  vehicle: string;
  service: string;
  cost: string;
  status: "In Shop" | "Completed";
};

const rows: ServiceRow[] = [
  { id: "M001", vehicle: "VAN-05", service: "Oil Change", cost: "Rs 3,500", status: "In Shop" },
  { id: "M002", vehicle: "TRK-11", service: "Engine Repair", cost: "Rs 18,000", status: "Completed" },
  { id: "M003", vehicle: "MINI-03", service: "Tyre Replace", cost: "Rs 4,200", status: "In Shop" },
];

const columns: Column<ServiceRow>[] = [
  { key: "vehicle", header: "Vehicle" },
  { key: "service", header: "Service" },
  { key: "cost", header: "Cost", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={row.status === "Completed" ? "success" : "warning"}
        label={row.status}
      />
    ),
  },
];

export default function MaintenancePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Maintenance"
        description="Create service records and control vehicle availability."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border border-border/80 bg-surface/95 p-5">
          <h2 className="text-sm font-semibold text-foreground">Log Service Record</h2>
          <div className="mt-4 grid gap-3">
            <Select placeholder="Vehicle">
              <Label>Vehicle</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="van-05">VAN-05</ListBox.Item>
                  <ListBox.Item id="truck-11">TRK-11</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <Input placeholder="Service type" aria-label="Service type" />
            <Input placeholder="Cost" aria-label="Cost" />
            <Input placeholder="Start date" aria-label="Start date" />
            <Select placeholder="Status">
              <Label>Status</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="active">In Shop</ListBox.Item>
                  <ListBox.Item id="completed">Completed</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <Button variant="primary" fullWidth>Save Service Record</Button>
          </div>
          <p className="mt-4 text-xs text-muted">
            Active service records move vehicles to In Shop automatically.
          </p>
        </Card>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Service Log</h2>
          <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
        </div>
      </div>
    </div>
  );
}
