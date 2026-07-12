"use client";

// OWNER: Saichandana · Fuel & Expense — live KPI row, fuel logs, expenses.
// Total Operational Cost = Fuel + Expenses (summed from the API).

import { useMemo } from "react";
import { Button, Card } from "@heroui/react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { QueryState } from "@/components/ui/query-state";
import { listFuelLogs, listExpenses } from "@/lib/api/finance";
import { listVehicles } from "@/lib/api/vehicles";
import { useApiData } from "@/lib/use-api";
import { inr, fmtDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";
import type { Expense, FuelLog, Vehicle } from "@/lib/domain";

interface FinanceData {
  fuel: FuelLog[];
  expenses: Expense[];
  vehicles: Vehicle[];
}

export function FuelExpensePanel() {
  const { data, loading, error, reload } = useApiData<FinanceData>(async () => {
    const [fuel, expenses, vehicles] = await Promise.all([
      listFuelLogs(),
      listExpenses(),
      listVehicles(),
    ]);
    return { fuel, expenses, vehicles };
  });

  const vehicleName = useMemo(() => {
    const map = new Map((data?.vehicles ?? []).map((v) => [v.id, v.registrationNumber]));
    return (id: string) => map.get(id) ?? id.slice(0, 8);
  }, [data]);

  const fuel = data?.fuel ?? [];
  const expenses = data?.expenses ?? [];
  const totalFuel = fuel.reduce((s, r) => s + r.cost, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  const operationalCost = totalFuel + totalExpenses;

  const fuelColumns: Column<FuelLog>[] = [
    { key: "vehicleId", header: "Vehicle", render: (r) => <span className="font-medium">{vehicleName(r.vehicleId)}</span> },
    { key: "fuelDate", header: "Date", render: (r) => fmtDate(r.fuelDate) },
    { key: "liters", header: "Liters", align: "right", render: (r) => `${r.liters} L` },
    { key: "odometer", header: "Odometer", align: "right", render: (r) => r.odometer.toLocaleString() },
    { key: "cost", header: "Fuel Cost", align: "right", render: (r) => inr(r.cost) },
  ];

  const expenseColumns: Column<Expense>[] = [
    { key: "vehicleId", header: "Vehicle", render: (r) => <span className="font-medium">{vehicleName(r.vehicleId)}</span> },
    { key: "type", header: "Type" },
    { key: "description", header: "Description", render: (r) => r.description || "—" },
    { key: "expenseDate", header: "Date", render: (r) => fmtDate(r.expenseDate) },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-medium">{inr(r.amount)}</span> },
  ];

  return (
    <QueryState loading={loading} error={error} onRetry={reload}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Fuel Cost" value={inr(totalFuel)} hint="This period" />
          <StatCard label="Other Expenses" value={inr(totalExpenses)} hint="Toll + misc" />
          <StatCard label="Operational Cost" value={inr(operationalCost)} hint="Fuel + expenses" accent />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Fuel Logs</h2>
            <Button
              variant="secondary"
              size="sm"
              isDisabled={fuel.length === 0}
              onPress={() =>
                downloadCsv(
                  "transitops-fuel-logs",
                  ["Vehicle", "Date", "Liters", "Odometer", "Fuel Cost (INR)"],
                  fuel.map((r) => [vehicleName(r.vehicleId), fmtDate(r.fuelDate), r.liters, r.odometer, r.cost]),
                )
              }
            >
              Export CSV
            </Button>
          </div>
          <DataTable columns={fuelColumns} rows={fuel} getRowKey={(r) => r.id} emptyMessage="No fuel logs yet." />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Other Expenses (Toll / Misc)</h2>
            <Button
              variant="secondary"
              size="sm"
              isDisabled={expenses.length === 0}
              onPress={() =>
                downloadCsv(
                  "transitops-expenses",
                  ["Vehicle", "Type", "Description", "Date", "Amount (INR)"],
                  expenses.map((r) => [vehicleName(r.vehicleId), r.type, r.description || "", fmtDate(r.expenseDate), r.amount]),
                )
              }
            >
              Export CSV
            </Button>
          </div>
          <DataTable columns={expenseColumns} rows={expenses} getRowKey={(r) => r.id} emptyMessage="No expenses logged yet." />
        </div>

        <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Total Operational Cost</p>
              <p className="mt-0.5 text-xs text-muted">Fuel + expenses · auto calculated</p>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-accent">{inr(operationalCost)}</p>
          </div>
        </Card>
      </div>
    </QueryState>
  );
}
