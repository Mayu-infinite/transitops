"use client";

// OWNER: Saichandana · Fuel & Expense — live KPI row, fuel logs, expenses.
// Total Operational Cost = Fuel + Expenses (summed from the API).

import { useMemo, useState } from "react";
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { QueryState } from "@/components/ui/query-state";
import { createExpense, createFuelLog, listFuelLogs, listExpenses } from "@/lib/api/finance";
import type { ExpenseType } from "@/lib/domain";
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
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [fuelVehicleId, setFuelVehicleId] = useState("");
  const [expenseVehicleId, setExpenseVehicleId] = useState("");
  const [liters, setLiters] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [fuelOdometer, setFuelOdometer] = useState(0);
  const [fuelDate, setFuelDate] = useState("");
  const [expenseType, setExpenseType] = useState<ExpenseType>("TOLL");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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

  const createFuelRecord = async () => {
    setFormError(null);
    if (!fuelVehicleId || liters <= 0 || fuelCost <= 0 || fuelOdometer < 0 || !fuelDate) {
      setFormError("Please complete all fuel log fields.");
      return;
    }
    setSaving(true);
    try {
      await createFuelLog({
        vehicleId: fuelVehicleId,
        liters,
        cost: fuelCost,
        odometer: fuelOdometer,
        fuelDate,
      });
      setFuelVehicleId("");
      setLiters(0);
      setFuelCost(0);
      setFuelOdometer(0);
      setFuelDate("");
      setShowFuelForm(false);
      reload();
              <Button variant="primary" size="sm" onPress={() => setShowFuelForm((value) => !value)}>
                {showFuelForm ? "Cancel" : "Log Fuel"}
              </Button>
    } catch (err) {
      setFormError("Unable to save fuel log. Please try again.");
          {showFuelForm ? (
            <Card className="mb-4 border border-border/80 bg-surface/95 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Select
                  placeholder="Vehicle"
                  selectedKey={fuelVehicleId}
                  onSelectionChange={(value) => setFuelVehicleId(String(value))}
                >
                  <Label>Vehicle</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {(data?.vehicles ?? []).map((v) => (
                        <ListBox.Item key={v.id} id={v.id}>
                          {v.registrationNumber}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Liters"
                  value={liters || ""}
                  onChange={(e) => setLiters(Number(e.target.value))}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Cost"
                  value={fuelCost || ""}
                  onChange={(e) => setFuelCost(Number(e.target.value))}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Odometer"
                  value={fuelOdometer || ""}
                  onChange={(e) => setFuelOdometer(Number(e.target.value))}
                />
                <Input
                  type="date"
                  placeholder="Fuel Date"
                  value={fuelDate}
                  onChange={(e) => setFuelDate(e.target.value)}
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="primary" onPress={createFuelRecord} isDisabled={saving}>
                  {saving ? "Saving..." : "Save Fuel Log"}
                </Button>
                {formError ? <span className="text-sm text-red-500">{formError}</span> : null}
              </div>
            </Card>
          ) : null}
    } finally {
      setSaving(false);
    }
  };

  const createExpenseRecord = async () => {
    setFormError(null);
    if (!expenseVehicleId || expenseAmount <= 0 || !expenseDate) {
      setFormError("Please complete all expense fields.");
      return;
    }
    setSaving(true);
    try {
      await createExpense({
        vehicleId: expenseVehicleId,
        type: expenseType,
        amount: expenseAmount,
        description: expenseDescription,
        expenseDate,
      });
      setExpenseVehicleId("");
      setExpenseAmount(0);
      setExpenseDescription("");
      setExpenseDate("");
      setExpenseType("TOLL");
      setShowExpenseForm(false);
      reload();
              <Button variant="primary" size="sm" onPress={() => setShowExpenseForm((value) => !value)}>
                {showExpenseForm ? "Cancel" : "Add Expense"}
              </Button>
    } catch (err) {
      setFormError("Unable to save expense. Please try again.");
          {showExpenseForm ? (
            <Card className="mb-4 border border-border/80 bg-surface/95 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Select
                  placeholder="Vehicle"
                  selectedKey={expenseVehicleId}
                  onSelectionChange={(value) => setExpenseVehicleId(String(value))}
                >
                  <Label>Vehicle</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {(data?.vehicles ?? []).map((v) => (
                        <ListBox.Item key={v.id} id={v.id}>
                          {v.registrationNumber}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <Input
                  placeholder="Description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
                <Input
                  placeholder="Type"
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Amount"
                  value={expenseAmount || ""}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                />
                <Input
                  type="date"
                  placeholder="Expense Date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="primary" onPress={createExpenseRecord} isDisabled={saving}>
                  {saving ? "Saving..." : "Save Expense"}
                </Button>
                {formError ? <span className="text-sm text-red-500">{formError}</span> : null}
              </div>
            </Card>
          ) : null}
    } finally {
      setSaving(false);
    }
  };

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
