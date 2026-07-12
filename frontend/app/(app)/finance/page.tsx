"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 6 · Fuel & Expense Management          OWNER: Saichandana
// Fuel Logs + Other Expenses + auto Total Operational Cost (Fuel + Maint.).
// ─────────────────────────────────────────────────────────────────────────
import { Button } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { FuelExpensePanel } from "@/components/finance/fuel-expense-panel";

export default function FinancePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Fuel & Expenses"
        description="Track fuel consumption, tolls, and operational costs per vehicle."
        actions={
          <>
            <Button variant="secondary" size="sm">
              + Add Expense
            </Button>
            <Button variant="primary" size="sm">
              + Log Fuel
            </Button>
          </>
        }
      />
      <FuelExpensePanel />
    </div>
  );
}
