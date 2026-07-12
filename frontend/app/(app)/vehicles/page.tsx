"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 2 · Vehicle Registry (Fleet)          OWNER: Mayuri
// TODO: wire filters + Add Vehicle modal + live data. Rules: reg number unique;
//       Retired/In Shop hidden from dispatch.
// ─────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { QueryState } from "@/components/ui/query-state";
import { VEHICLE_STATUS_TONE, type Vehicle, type VehicleStatus, type VehicleType } from "@/lib/domain";
import { StatusBadge } from "@/components/ui/status-badge";
import { createVehicle, listVehicles } from "@/lib/api/vehicles";
import { useApiData } from "@/lib/use-api";
import { inr } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";

const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

const columns: Column<Vehicle>[] = [
  { key: "registrationNumber", header: "Reg. No.", render: (r) => <span className="font-medium">{r.registrationNumber}</span> },
  {
    key: "name",
    header: "Name / Model",
    render: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted">{row.model}</p>
      </div>
    ),
  },
  { key: "type", header: "Type" },
  {
    key: "maxLoadCapacity",
    header: "Capacity",
    align: "right",
    render: (row) => `${row.maxLoadCapacity.toLocaleString()} kg`,
  },
  {
    key: "odometer",
    header: "Odometer",
    align: "right",
    render: (row) => row.odometer.toLocaleString(),
  },
  {
    key: "acquisitionCost",
    header: "Acq. Cost",
    align: "right",
    render: (row) => inr(row.acquisitionCost),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={VEHICLE_STATUS_TONE[row.status]}
        label={STATUS_LABEL[row.status]}
      />
    ),
  },
];

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState<VehicleType>("TRUCK");
  const [maxLoadCapacity, setMaxLoadCapacity] = useState(0);
  const [odometer, setOdometer] = useState(0);
  const [acquisitionCost, setAcquisitionCost] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, loading, error, reload } = useApiData<Vehicle[]>(() => listVehicles());

  const rows = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((v) =>
      [v.registrationNumber, v.name, v.model, v.type].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [data, search]);

  const exportCsv = () =>
    downloadCsv(
      "transitops-fleet",
      ["Reg. No.", "Name", "Model", "Type", "Capacity (kg)", "Odometer", "Acq. Cost (INR)", "Status"],
      rows.map((v) => [
        v.registrationNumber,
        v.name,
        v.model,
        v.type,
        v.maxLoadCapacity,
        v.odometer,
        v.acquisitionCost,
        STATUS_LABEL[v.status],
      ]),
    );

  const handleCreateVehicle = async () => {
    setFormError(null);
    if (!registrationNumber || !name || !model || !type || maxLoadCapacity <= 0 || odometer < 0 || acquisitionCost <= 0) {
      setFormError("Please complete all vehicle fields with valid values.");
      return;
    }

    setSaving(true);
    try {
      await createVehicle({
        registrationNumber,
        name,
        model,
        type,
        maxLoadCapacity,
        odometer,
        acquisitionCost,
      });
      setRegistrationNumber("");
      setName("");
      setModel("");
      setType("TRUCK");
      setMaxLoadCapacity(0);
      setOdometer(0);
      setAcquisitionCost(0);
      setShowCreate(false);
      reload();
    } catch {
      setFormError("Unable to add vehicle. Please check your input and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Fleet"
        description="Master registry of every vehicle in your fleet."
        actions={
          <>
            <Button variant="secondary" size="sm" onPress={exportCsv} isDisabled={rows.length === 0}>
              Export CSV
            </Button>
            <Button variant="primary" size="sm" onPress={() => setShowCreate((current) => !current)}>
              {showCreate ? "Cancel" : "+ Add Vehicle"}
            </Button>
          </>
        }
      />
      {showCreate ? (
        <Card className="mb-5 border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Reg. No."
              aria-label="Registration number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
            <Input
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Max Load Capacity"
              value={maxLoadCapacity || ""}
              onChange={(e) => setMaxLoadCapacity(Number(e.target.value))}
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Odometer"
              value={odometer || ""}
              onChange={(e) => setOdometer(Number(e.target.value))}
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Acquisition Cost"
              value={acquisitionCost || ""}
              onChange={(e) => setAcquisitionCost(Number(e.target.value))}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" onPress={handleCreateVehicle} isDisabled={saving}>
              {saving ? "Saving..." : "Save Vehicle"}
            </Button>
            {formError ? <span className="text-sm text-red-500">{formError}</span> : null}
          </div>
        </Card>
      ) : null}

      <Card className="mb-5 border border-border/80 bg-surface/95 p-4">
        <Input
          placeholder="Search reg. no, name, model, type..."
          aria-label="Search vehicles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>
      <QueryState loading={loading} error={error} onRetry={reload}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          emptyMessage="No vehicles registered yet."
        />
      </QueryState>
      <p className="mt-4 text-xs text-muted">
        Rule: Retired and In Shop vehicles are hidden from trip dispatch.
      </p>
    </div>
  );
}
