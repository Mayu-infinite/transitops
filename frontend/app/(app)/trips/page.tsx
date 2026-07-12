"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 4 · Trip Dispatcher                    OWNER: Mayuri
// TODO: lifecycle stepper · Create Trip form (available vehicle/driver only,
//       cargo ≤ capacity) · Live Board. Dispatch/complete/cancel flip statuses.
// ─────────────────────────────────────────────────────────────────────────
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TRIP_STATUS_TONE, type TripStatus } from "@/lib/domain";

const LIFECYCLE = ["Draft", "Dispatched", "Completed", "Cancelled"];
const STATUS_LABEL: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const LIVE_TRIPS: {
  id: string;
  route: string;
  vehicle: string;
  driver: string;
  eta: string;
  status: TripStatus;
}[] = [
  {
    id: "TR001",
    route: "Mumbai Depot -> Andheri Hub",
    vehicle: "VAN-05",
    driver: "Alex",
    eta: "45 min",
    status: "DISPATCHED",
  },
  {
    id: "TR002",
    route: "Pune Yard -> Surat Warehouse",
    vehicle: "TRK-11",
    driver: "Zain",
    eta: "Awaiting driver",
    status: "DRAFT",
  },
  {
    id: "TR006",
    route: "Navi Mumbai -> Thane",
    vehicle: "MINI-03",
    driver: "Priya",
    eta: "Completed",
    status: "COMPLETED",
  },
];

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Trips"
        description="Create, dispatch, and track trips across your fleet."
        actions={<Button variant="primary" size="sm">+ New Trip</Button>}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {LIFECYCLE.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-secondary text-xs font-medium">
                {i + 1}
              </span>
              {step}
            </span>
            {i < LIFECYCLE.length - 1 ? (
              <span className="text-muted">→</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <h2 className="text-sm font-semibold text-foreground">Create Trip</h2>
          <div className="mt-4 grid gap-3">
            <Input placeholder="Source" aria-label="Source" />
            <Input placeholder="Destination" aria-label="Destination" />
            <Select placeholder="Available vehicle">
              <Label>Available vehicle</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="van-05">VAN-05 - 500 kg</ListBox.Item>
                  <ListBox.Item id="car-02">CAR-02 - 250 kg</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <Select placeholder="Available driver">
              <Label>Available driver</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="alex">Alex</ListBox.Item>
                  <ListBox.Item id="suresh">Suresh</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Cargo kg" aria-label="Cargo weight" />
              <Input placeholder="Distance km" aria-label="Planned distance" />
            </div>
            <Card className="border border-sky-500/30 bg-sky-500/10 p-3">
              <p className="text-xs font-medium text-sky-500">
                Capacity check: cargo weight must not exceed selected vehicle capacity.
              </p>
            </Card>
            <Button variant="primary" fullWidth>
              Dispatch Available Trip
            </Button>
          </div>
        </Card>

        <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Live Board</h2>
            <span className="text-xs text-muted">Auto status transitions</span>
          </div>
          <div className="mt-4 space-y-3">
            {LIVE_TRIPS.map((trip) => (
              <div
                key={trip.id}
                className="rounded-lg border border-border bg-background/50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{trip.id}</p>
                    <p className="mt-1 text-sm text-muted">{trip.route}</p>
                  </div>
                  <StatusBadge
                    tone={TRIP_STATUS_TONE[trip.status]}
                    label={STATUS_LABEL[trip.status]}
                  />
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-3">
                  <span>Vehicle: {trip.vehicle}</span>
                  <span>Driver: {trip.driver}</span>
                  <span>ETA: {trip.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
