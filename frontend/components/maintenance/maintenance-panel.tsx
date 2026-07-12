"use client";

// OWNER: Saichandana · Maintenance — Log Service Record form + Service Log table.
// Rule: an ACTIVE (Open / In Progress) record puts the vehicle In Shop and
// removes it from the dispatch pool until it is Resolved.

import { FormEvent, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { QueryState } from "@/components/ui/query-state";
import {
  MAINTENANCE_STATUS_TONE,
  type MaintenanceRecord,
  type MaintenanceStatus,
  type Vehicle,
} from "@/lib/domain";
import { createMaintenance, listMaintenance } from "@/lib/api/maintenance";
import { listVehicles } from "@/lib/api/vehicles";
import { useApiData } from "@/lib/use-api";
import { useAuth } from "@/lib/auth-context";
import { inr, fmtDate } from "@/lib/format";

const STATUS_LABEL: Record<MaintenanceStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Resolved",
};

interface MaintenanceData {
  records: MaintenanceRecord[];
  vehicles: Vehicle[];
}

export function MaintenancePanel() {
  const { user } = useAuth();
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState<MaintenanceStatus>("OPEN");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, loading, error, reload } = useApiData<MaintenanceData>(async () => {
    const [records, vehicles] = await Promise.all([listMaintenance(), listVehicles()]);
    return { records, vehicles };
  });

  const vehicleName = useMemo(() => {
    const map = new Map((data?.vehicles ?? []).map((v) => [v.id, v.registrationNumber]));
    return (id: string) => map.get(id) ?? id.slice(0, 8);
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("You must be signed in to create a maintenance record.");
      return;
    }

    if (!vehicleId) {
      setFormError("Please select a vehicle.");
      return;
    }

    if (!description.trim()) {
      setFormError("Please enter a service description.");
      return;
    }

    if (!cost || cost <= 0) {
      setFormError("Please enter a valid cost.");
      return;
    }

    if (!startDate) {
      setFormError("Please select a start date.");
      return;
    }

    setSaving(true);

    try {
      await createMaintenance({
        vehicleId,
        description,
        cost,
        startDate,
        status,
        createdById: user.id,
      });

      setVehicleId("");
      setDescription("");
      setCost(0);
      setStartDate("");
      setStatus("OPEN");
      reload();
    } catch (err) {
      setFormError("Unable to save the maintenance record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<MaintenanceRecord>[] = [
    { key: "vehicleId", header: "Vehicle", render: (r) => <span className="font-medium">{vehicleName(r.vehicleId)}</span> },
    { key: "description", header: "Service", render: (r) => r.description || "—" },
    { key: "cost", header: "Cost", align: "right", render: (r) => inr(r.cost) },
    { key: "startDate", header: "Date", render: (r) => fmtDate(r.startDate) },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge tone={MAINTENANCE_STATUS_TONE[r.status]} label={STATUS_LABEL[r.status]} />,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Log Service Record */}
      <Card className="h-fit border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
        <h2 className="text-sm font-semibold text-foreground">Log Service Record</h2>
        <p className="mt-1 text-xs text-muted">Open a maintenance ticket for a vehicle.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select vehicle"
            selectedKey={vehicleId}
            onSelectionChange={(key) => setVehicleId(key as string)}
          >
            <Label className="text-xs font-medium text-muted">Vehicle</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {(data?.vehicles.length ?? 0) === 0 ? (
                  <ListBox.Item id="none" isDisabled>
                    No vehicles available
                  </ListBox.Item>
                ) : (
                  data?.vehicles.map((v) => (
                    <ListBox.Item key={v.id} id={v.id}>
                      {v.registrationNumber}
                    </ListBox.Item>
                  ))
                )}
              </ListBox>
            </Select.Popover>
          </Select>

          <TextField className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted">Service Type</Label>
            <Input
              placeholder="e.g. Oil Change"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </TextField>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted">Cost (₹)</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="2500"
                value={cost || ""}
                onChange={(event) => setCost(Number(event.target.value))}
              />
            </TextField>

            <TextField className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted">Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </TextField>
          </div>

          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select status"
            selectedKey={status}
            onSelectionChange={(key) => setStatus(key as MaintenanceStatus)}
          >
            <Label className="text-xs font-medium text-muted">Status</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="OPEN">Open</ListBox.Item>
                <ListBox.Item id="IN_PROGRESS">In Progress</ListBox.Item>
                <ListBox.Item id="COMPLETED">Resolved</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          {formError ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div> : null}

          <Button variant="primary" fullWidth isDisabled={saving}>
            {saving ? "Saving..." : "Save Record"}
          </Button>
        </form>

        <div className="mt-5 flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs leading-relaxed text-muted">
            A vehicle with an <span className="font-medium text-foreground">active</span> service record
            (Open / In Progress) is marked <span className="font-medium text-foreground">In Shop</span> and
            removed from the dispatch pool until the record is resolved.
          </p>
        </div>
      </Card>

      {/* Service Log */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Service Log</h2>
        <QueryState loading={loading} error={error} onRetry={reload}>
          <DataTable
            columns={columns}
            rows={data?.records ?? []}
            getRowKey={(r) => r.id}
            emptyMessage="No service records yet."
          />
        </QueryState>
      </div>
    </div>
  );
}
