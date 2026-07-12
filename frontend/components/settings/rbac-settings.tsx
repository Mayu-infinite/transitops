"use client";

// OWNER: Saichandana · Settings & RBAC components. TODO: general form, RBAC matrix.

import { Button, Card, Input } from "@heroui/react";

const ROLES = [
  ["Fleet Manager", "✔", "✔", "✔", "✔", "✔"],
  ["Dispatcher", "View", "—", "✔", "—", "—"],
  ["Safety Officer", "—", "✔", "View", "—", "View"],
  ["Financial Analyst", "View", "—", "—", "✔", "✔"],
];

export function RbacSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          General Settings
        </h2>

        <div className="space-y-3">
          <Input placeholder="Depot Name" defaultValue="Gandhinagar Depot" />
          <Input placeholder="Currency" defaultValue="INR (₹)" />
          <Input placeholder="Distance Unit" defaultValue="Kilometers" />

          <Button variant="primary" className="mt-2 w-full">
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Role Based Access Matrix
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3">Role</th>
              <th className="pb-3">Fleet</th>
              <th className="pb-3">Drivers</th>
              <th className="pb-3">Trips</th>
              <th className="pb-3">Fuel / Maint.</th>
              <th className="pb-3">Analytics</th>
            </tr>
          </thead>

          <tbody>
            {ROLES.map((role) => (
              <tr key={role[0]} className="border-b border-border/50">
                {role.map((cell, index) => (
                  <td
                    key={`${role[0]}-${index}`}
                    className={`py-3 ${
                      index === 0 ? "font-medium" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}