"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 6 · Fuel & Expense Management          OWNER: Saichandana
// Mockup: "6. Fuel & Expense Management"
// TODO: Fuel Logs table (vehicle, date, liters, cost) · Log Fuel · Add Expense ·
//       Other Expenses table (toll/misc) · auto Total Operational Cost
//       (Fuel + Maintenance) per vehicle.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

type FuelRow = {
  id: string;
  vehicle: string;
  date: string;
  liters: string;
  cost: string;
};

type ExpenseRow = {
  id: string;
  trip: string;
  toll: string;
  other: string;
  maintenance: string;
  status: "Available" | "Completed";
};

const fuelRows: FuelRow[] = [
  { id: "F1", vehicle: "VAN-05", date: "05 Jul 2026", liters: "42 L", cost: "Rs 4,580" },
  { id: "F2", vehicle: "TRK-11", date: "06 Jul 2026", liters: "110 L", cost: "Rs 9,900" },
  { id: "F3", vehicle: "MINI-03", date: "06 Jul 2026", liters: "24 L", cost: "Rs 2,050" },
];

const expenseRows: ExpenseRow[] = [
  { id: "E1", trip: "TR001", toll: "Rs 540", other: "Rs 0", maintenance: "Rs 0", status: "Available" },
  { id: "E2", trip: "TR002", toll: "Rs 740", other: "Rs 150", maintenance: "Rs 18,000", status: "Completed" },
];

const fuelColumns: Column<FuelRow>[] = [
  { key: "vehicle", header: "Vehicle" },
  { key: "date", header: "Date" },
  { key: "liters", header: "Liters", align: "right" },
  { key: "cost", header: "Cost", align: "right" },
];

const expenseColumns: Column<ExpenseRow>[] = [
  { key: "trip", header: "Trip" },
  { key: "toll", header: "Toll", align: "right" },
  { key: "other", header: "Other", align: "right" },
  { key: "maintenance", header: "Maint.", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={row.status === "Completed" ? "success" : "info"}
        label={row.status}
      />
    ),
  },
];

export default function FinancePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Fuel & Expenses"
        description="Track fuel logs, tolls, and maintenance cost per vehicle."
        actions={
          <>
            <Button variant="secondary" size="sm">+ Log Fuel</Button>
            <Button variant="primary" size="sm">+ Add Expense</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border/80 bg-surface/95 p-5">
          <p className="text-xs font-semibold uppercase text-muted">Fuel Cost</p>
          <p className="mt-2 text-2xl font-semibold">Rs 16,530</p>
        </Card>
        <Card className="border border-border/80 bg-surface/95 p-5">
          <p className="text-xs font-semibold uppercase text-muted">Maintenance</p>
          <p className="mt-2 text-2xl font-semibold">Rs 22,200</p>
        </Card>
        <Card className="border border-border/80 bg-accent-soft p-5">
          <p className="text-xs font-semibold uppercase text-accent-soft-foreground">
            Total Operational Cost
          </p>
          <p className="mt-2 text-2xl font-semibold text-accent-soft-foreground">
            Rs 34,070
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Fuel Logs</h2>
          <DataTable columns={fuelColumns} rows={fuelRows} getRowKey={(row) => row.id} />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Other Expenses</h2>
          <DataTable columns={expenseColumns} rows={expenseRows} getRowKey={(row) => row.id} />
        </div>
      </div>
    </div>
  );
}
