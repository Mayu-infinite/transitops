"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 8 · Settings & RBAC                     OWNER: Saichandana
// Mockup: "8. Settings & RBAC"
// TODO: General settings (depot name, currency, distance unit) · Role-Based
//       Access matrix (Fleet Manager / Dispatcher / Safety Officer / Financial
//       Analyst × Fleet/Drivers/Trips/Fuel-Maint/Analytics) · Save Changes.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card, Input } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";

const MATRIX = [
  ["Fleet Manager", "✔", "✔", "—", "—", "✔"],
  ["Dispatcher", "View", "—", "✔", "—", "—"],
  ["Safety Officer", "—", "✔", "View", "—", "—"],
  ["Financial Analyst", "View", "—", "—", "✔", "✔"],
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Settings & RBAC"
        description="General workspace settings and role-based access matrix."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border border-border/80 bg-surface/95 p-5">
          <h2 className="text-sm font-semibold text-foreground">General</h2>
          <div className="mt-4 grid gap-3">
            <Input defaultValue="Gandhinagar Depot" aria-label="Depot name" />
           <Input defaultValue="INR (₹)" aria-label="Currency" />
           <Input defaultValue="Kilometers" aria-label="Distance unit" />
            <Button variant="primary" className="mt-2 w-fit">
              Save Changes
            </Button>
          </div>
        </Card>

        <Card className="border border-border/80 bg-surface/95 p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Role-Based Access
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-160 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase text-muted">
                  <th className="py-3 pr-4">Role</th>
                  <th className="px-3 py-3">Fleet</th>
                  <th className="px-3 py-3">Drivers</th>
                  <th className="px-3 py-3">Trips</th>
                  <th className="px-3 py-3">Fuel/Maint.</th>
                  <th className="px-3 py-3">Analytics</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 last:border-0">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className={`py-3 ${index === 0 ? "pr-4 font-medium" : "px-3 text-muted"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
