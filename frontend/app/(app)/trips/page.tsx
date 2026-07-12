"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 4 · Trip Dispatcher                    OWNER: Mayuri
// Live Board + Create Trip form. Vehicle/driver options and the board are live;
// dispatch/complete/cancel flip statuses server-side.
// ─────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Button, Card, Input, Label, ListBox, Select } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { QueryState } from "@/components/ui/query-state";
import {
  TRIP_STATUS_TONE,
  type Driver,
  type Trip,
  type TripStatus,
  type Vehicle,
} from "@/lib/domain";
import { createTrip, dispatchTrip, listTrips } from "@/lib/api/trips";
import { listVehicles } from "@/lib/api/vehicles";
import { listDrivers } from "@/lib/api/drivers";
import { useAuth } from "@/lib/auth-context";
import { useApiData } from "@/lib/use-api";

const LIFECYCLE = ["Draft", "Dispatched", "Completed", "Cancelled"];
const STATUS_LABEL: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

type TripWithRelations = Trip & { vehicle?: Vehicle; driver?: Driver };

interface TripsData {
  trips: TripWithRelations[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export default function TripsPage() {
  const { user } = useAuth();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [cargoWeight, setCargoWeight] = useState(0);
  const [plannedDistance, setPlannedDistance] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { data, loading, error, reload } = useApiData<TripsData>(async () => {
    const [trips, vehicles, drivers] = await Promise.all([
      listTrips() as Promise<TripWithRelations[]>,
      listVehicles(),
      listDrivers(),
    ]);
    return { trips, vehicles, drivers };
  });

  const availableVehicles = (data?.vehicles ?? []).filter((v) => v.status === "AVAILABLE");
  const availableDrivers = (data?.drivers ?? []).filter((d) => d.status === "AVAILABLE");
  const trips = data?.trips ?? [];

  const resetForm = () => {
    setSource("");
    setDestination("");
    setVehicleId("");
    setDriverId("");
    setCargoWeight(0);
    setPlannedDistance(0);
    setFormError(null);
  };

  const createAndDispatchTrip = async () => {
    setFormError(null);
    if (!user?.id) {
      setFormError("You must be logged in to create a trip.");
      return;
    }
    if (!source || !destination || !vehicleId || !driverId || cargoWeight <= 0 || plannedDistance <= 0) {
      setFormError("Please complete all trip fields before dispatching.");
      return;
    }
    setSaving(true);
    try {
      const trip = await createTrip({
        source,
        destination,
        vehicleId,
        driverId,
        cargoWeight,
        plannedDistance,
        createdBy: user.id,
      }).then((created) => dispatchTrip(created.id));
      if (trip) {
        resetForm();
        reload();
      }
    } catch (err) {
      setFormError("Unable to dispatch trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
            <span className="flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1 text-sm text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-surface-secondary text-xs font-medium">
                {i + 1}
              </span>
              {step}
            </span>
            {i < LIFECYCLE.length - 1 ? <span className="text-muted">→</span> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <h2 className="text-sm font-semibold text-foreground">Create Trip</h2>
          <div className="mt-4 grid gap-3">
            <Input placeholder="Source" aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)} />
            <Input placeholder="Destination" aria-label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <Select
              placeholder="Available vehicle"
              selectedKey={vehicleId}
              onSelectionChange={(key) => setVehicleId(String(key))}
            >
              <Label>Available vehicle</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {availableVehicles.length === 0 ? (
                    <ListBox.Item id="none" isDisabled>
                      No available vehicles
                    </ListBox.Item>
                  ) : (
                    availableVehicles.map((v) => (
                      <ListBox.Item key={v.id} id={v.id}>
                        {v.registrationNumber} — {v.maxLoadCapacity} kg
                      </ListBox.Item>
                    ))
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <Select
              placeholder="Available driver"
              selectedKey={driverId}
              onSelectionChange={(key) => setDriverId(String(key))}
            >
              <Label>Available driver</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {availableDrivers.length === 0 ? (
                    <ListBox.Item id="none" isDisabled>
                      No available drivers
                    </ListBox.Item>
                  ) : (
                    availableDrivers.map((d) => (
                      <ListBox.Item key={d.id} id={d.id}>
                        {d.name}
                      </ListBox.Item>
                    ))
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Cargo kg"
                aria-label="Cargo weight"
                value={cargoWeight || ""}
                onChange={(e) => setCargoWeight(Number(e.target.value))}
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Distance km"
                aria-label="Planned distance"
                value={plannedDistance || ""}
                onChange={(e) => setPlannedDistance(Number(e.target.value))}
              />
            </div>
            <Card className="border border-sky-500/30 bg-sky-500/10 p-3">
              <p className="text-xs font-medium text-sky-500">
                Capacity check: cargo weight must not exceed selected vehicle capacity.
              </p>
            </Card>
            <Button variant="primary" fullWidth onPress={createAndDispatchTrip} isDisabled={saving}>
              Dispatch Trip
            </Button>
            {formError ? <p className="text-sm text-red-500">{formError}</p> : null}
          </div>
        </Card>

        <Card className="border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Live Board</h2>
            <span className="text-xs text-muted">{trips.length} trip(s)</span>
          </div>
          <div className="mt-4">
            <QueryState loading={loading} error={error} onRetry={reload}>
              {trips.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">
                  No trips yet. Create one to see it on the live board.
                </p>
              ) : (
                <div className="space-y-3">
                  {trips.map((trip) => (
                    <div key={trip.id} className="rounded-2xl border border-border bg-background/50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{trip.id.slice(0, 8)}</p>
                          <p className="mt-1 text-sm text-muted">
                            {trip.source} → {trip.destination}
                          </p>
                        </div>
                        <StatusBadge tone={TRIP_STATUS_TONE[trip.status]} label={STATUS_LABEL[trip.status]} />
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-3">
                        <span>Vehicle: {trip.vehicle?.registrationNumber ?? "—"}</span>
                        <span>Driver: {trip.driver?.name ?? "—"}</span>
                        <span>Distance: {trip.plannedDistance} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </QueryState>
          </div>
        </Card>
      </div>
    </div>
  );
}
