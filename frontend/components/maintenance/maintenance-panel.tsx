"use client";

// OWNER: Saichandana · Maintenance components. TODO: log-service form, service-log table.

import { Button, Card, Input } from "@heroui/react";

const SERVICE_LOGS = [
  {
    vehicle: "VAN-05",
    service: "Oil Change",
    cost: "₹2,500",
    status: "In Shop",
  },
  {
    vehicle: "TRUCK-11",
    service: "Engine Repair",
    cost: "₹18,000",
    status: "Completed",
  },
  {
    vehicle: "MINI-03",
    service: "Tyre Replace",
    cost: "₹6,200",
    status: "In Shop",
  },
];

export function MaintenancePanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Log Service Record
        </h2>

        <div className="space-y-3">
          <Input placeholder="Vehicle ID" />
          <Input placeholder="Service Type" />
          <Input placeholder="Cost" />
          <Input placeholder="Date" />
          <Input placeholder="Status" />

          <Button variant="primary" className="w-full">
            Save Record
          </Button>
        </div>

        <div className="mt-8 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-green-600">Available</span>
            <span>→</span>
            <span className="text-orange-500">In Shop</span>
          </div>

          <div className="flex justify-between">
            <span className="text-orange-500">In Shop</span>
            <span>→</span>
            <span className="text-green-600">Available</span>
          </div>

          <p className="pt-2 text-xs text-muted">
            Note: Vehicles marked <b>In Shop</b> are automatically removed
            from the dispatch pool until service is completed.
          </p>
        </div>
      </Card>

      <Card className="border border-border/80 bg-surface/95 p-5">
        <h2 className="mb-4 text-sm font-semibold">
          Service Log
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3">Vehicle</th>
              <th className="pb-3">Service</th>
              <th className="pb-3">Cost</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {SERVICE_LOGS.map((log) => (
              <tr key={log.vehicle} className="border-b border-border/50">
                <td className="py-3">{log.vehicle}</td>
                <td>{log.service}</td>
                <td>{log.cost}</td>

                <td>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-medium text-white ${
                      log.status === "Completed"
                        ? "bg-green-600"
                        : "bg-orange-500"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
