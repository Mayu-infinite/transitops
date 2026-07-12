"use client";

// OWNER: Saichandana · Fuel & Expense components. TODO: fuel-log table, expense table, log/add forms.

import { Button, Card, Input } from "@heroui/react";

const FUEL_LOGS = [
  {
    vehicle: "VAN-05",
    date: "05 Jul 2026",
    liters: "42 L",
    cost: "₹3,560",
  },
  {
    vehicle: "TRUCK-11",
    date: "06 Jul 2026",
    liters: "70 L",
    cost: "₹5,400",
  },
  {
    vehicle: "MINI-03",
    date: "06 Jul 2026",
    liters: "25 L",
    cost: "₹2,050",
  },
];

const EXPENSES = [
  {
    trip: "TRD01",
    vehicle: "VAN-05",
    toll: "₹120",
    other: "₹0",
    amount: "₹120",
  },
  {
    trip: "TRD07",
    vehicle: "TRK-12",
    toll: "₹340",
    other: "₹50",
    amount: "₹390",
  },
];

export function FuelExpensePanel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <Button variant="primary" size="sm">
          + Log Fuel
        </Button>

        <Button variant="secondary" size="sm">
          + Add Expense
        </Button>
      </div>

      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Fuel Logs
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3">Vehicle</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Liters</th>
              <th className="pb-3">Fuel Cost</th>
            </tr>
          </thead>

          <tbody>
            {FUEL_LOGS.map((fuel) => (
              <tr key={fuel.vehicle} className="border-b border-border/50">
                <td className="py-3">{fuel.vehicle}</td>
                <td>{fuel.date}</td>
                <td>{fuel.liters}</td>
                <td>{fuel.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Other Expenses
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3">Trip</th>
              <th className="pb-3">Vehicle</th>
              <th className="pb-3">Toll</th>
              <th className="pb-3">Other</th>
              <th className="pb-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {EXPENSES.map((expense) => (
              <tr key={expense.trip} className="border-b border-border/50">
                <td className="py-3">{expense.trip}</td>
                <td>{expense.vehicle}</td>
                <td>{expense.toll}</td>
                <td>{expense.other}</td>
                <td>{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-t border-border pt-4 text-right">
          <p className="text-sm font-semibold">
            Total Operational Cost:{" "}
            <span className="text-amber-500">₹34,070</span>
          </p>

          <p className="mt-1 text-xs text-muted">
            Fuel + Maintenance (auto calculated)
          </p>
        </div>
      </Card>
    </div>
  );
}