"use client";

import { Card } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/types";

// Placeholder KPIs from the TransitOps spec. These are static until the backend
// analytics endpoints are wired up.
const KPIS = [
  { label: "Active Vehicles", value: "—", hint: "Currently on trips" },
  { label: "Available Vehicles", value: "—", hint: "Ready to dispatch" },
  { label: "In Maintenance", value: "—", hint: "Vehicles in shop" },
  { label: "Active Trips", value: "—", hint: "In progress" },
  { label: "Pending Trips", value: "—", hint: "Awaiting dispatch" },
  { label: "Drivers On Duty", value: "—", hint: "Available drivers" },
  { label: "Fleet Utilization", value: "—", hint: "% of fleet in use" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted">
          Signed in as {user ? ROLE_LABELS[user.role] : ""}. Here&apos;s your
          fleet at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <Card.Content className="flex flex-col gap-1 py-5">
              <span className="text-sm text-muted">{kpi.label}</span>
              <span className="text-3xl font-semibold tracking-tight">
                {kpi.value}
              </span>
              <span className="text-xs text-muted">{kpi.hint}</span>
            </Card.Content>
          </Card>
        ))}
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Getting started</Card.Title>
          <Card.Description>
            Authentication is wired up. Fleet, driver, trip, maintenance, and
            finance modules connect here as they come online.
          </Card.Description>
        </Card.Header>
        <Card.Content className="text-sm text-muted">
          Use the navigation on the left to move between modules. Your access is
          scoped to your role.
        </Card.Content>
      </Card>
    </div>
  );
}
