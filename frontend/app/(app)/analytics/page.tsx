"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 7 · Reports & Analytics                OWNER: Saichandana
// KPI cards · Monthly Revenue chart · Top Costliest Vehicles · CSV export.
// ROI = (Revenue - (Maint + Fuel)) / AcqCost.
// ─────────────────────────────────────────────────────────────────────────
import { PageHeader } from "@/components/ui/page-header";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports & Analytics"
        description="Utilization, operational cost, and per-vehicle spend insights."
      />
      <AnalyticsView />
    </div>
  );
}
