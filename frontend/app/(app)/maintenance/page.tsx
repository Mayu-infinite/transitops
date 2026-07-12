"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 5 · Maintenance                        OWNER: Saichandana
// Log Service Record form + Service Log table. Rule: an active record ->
// vehicle In Shop (removed from dispatch pool); resolved -> Available.
// ─────────────────────────────────────────────────────────────────────────
import { PageHeader } from "@/components/ui/page-header";
import { MaintenancePanel } from "@/components/maintenance/maintenance-panel";

export default function MaintenancePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Maintenance"
        description="Log service records and track vehicles currently in the shop."
      />
      <MaintenancePanel />
    </div>
  );
}
