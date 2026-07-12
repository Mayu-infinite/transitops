"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 3 · Drivers & Safety Profiles          OWNER: Saichandana
// Rule: expired license OR Terminated -> blocked from trip assignment.
// ─────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { QueryState } from "@/components/ui/query-state";
import { DRIVER_STATUS_TONE, type Driver, type DriverStatus } from "@/lib/domain";
import { listDrivers } from "@/lib/api/drivers";
import { useApiData } from "@/lib/use-api";
import { fmtDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";

const STATUS_LABEL: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  ON_LEAVE: "On Leave",
  TERMINATED: "Terminated",
};

const columns: Column<Driver>[] = [
  { key: "name", header: "Driver", render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "licenseNumber", header: "License No." },
  { key: "licenseCategory", header: "Category" },
  { key: "licenseExpiry", header: "Expiry", render: (r) => fmtDate(r.licenseExpiry) },
  { key: "contactNumber", header: "Contact" },
  {
    key: "safetyScore",
    header: "Safety",
    align: "right",
    render: (r) => `${Math.round(r.safetyScore)}%`,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <StatusBadge tone={DRIVER_STATUS_TONE[r.status]} label={STATUS_LABEL[r.status]} />
    ),
  },
];

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, reload } = useApiData<Driver[]>(() => listDrivers());

  const rows = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((d) =>
      [d.name, d.licenseNumber, d.licenseCategory].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [data, search]);

  const exportCsv = () =>
    downloadCsv(
      "transitops-drivers",
      ["Driver", "License No.", "Category", "Expiry", "Contact", "Safety", "Status"],
      rows.map((d) => [
        d.name,
        d.licenseNumber,
        d.licenseCategory,
        fmtDate(d.licenseExpiry),
        d.contactNumber,
        `${Math.round(d.safetyScore)}%`,
        STATUS_LABEL[d.status],
      ]),
    );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Drivers & Safety Profiles"
        description="Manage driver profiles, licenses, and safety records."
        actions={
          <>
            <Button variant="secondary" size="sm" onPress={exportCsv} isDisabled={rows.length === 0}>
              Export CSV
            </Button>
            <Button variant="primary" size="sm">
              + Add Driver
            </Button>
          </>
        }
      />

      <Card className="mb-5 border border-border/80 bg-surface/95 p-4">
        <Input
          placeholder="Search name, license no, category..."
          aria-label="Search drivers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <QueryState loading={loading} error={error} onRetry={reload}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          emptyMessage="No drivers registered yet."
        />
      </QueryState>

      <p className="mt-4 text-xs text-muted">
        Rule: an expired license or Terminated status blocks a driver from trip
        assignment.
      </p>
    </div>
  );
}
