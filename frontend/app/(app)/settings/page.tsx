"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 8 · Settings & RBAC                     OWNER: Saichandana
// General settings + role/module access matrix (derived from lib/rbac).
// ─────────────────────────────────────────────────────────────────────────
import { PageHeader } from "@/components/ui/page-header";
import { RbacSettings } from "@/components/settings/rbac-settings";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Settings & RBAC"
        description="General workspace settings and role-based access matrix."
      />
      <RbacSettings />
    </div>
  );
}
