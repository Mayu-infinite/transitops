"use client";

// OWNER: Saichandana · Settings & RBAC — general settings + role/module access
// matrix. The matrix is derived from the real NAV_ITEMS gating in lib/rbac so it
// always reflects what each role can actually reach in the app.

import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { NAV_ITEMS, canAccess } from "@/lib/rbac";
import { ROLES, ROLE_LABELS } from "@/lib/types";

// Operational modules = nav items that are role-gated (skips Dashboard/Settings).
const MODULES = NAV_ITEMS.filter((item) => item.roles && item.roles.length > 0);

function AccessCell({ allowed }: { allowed: boolean }) {
  if (!allowed) {
    return <span className="text-muted/60">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Access
    </span>
  );
}

export function RbacSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      {/* General settings */}
      <Card className="h-fit border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5">
        <h2 className="text-sm font-semibold text-foreground">General</h2>
        <p className="mt-1 text-xs text-muted">Workspace defaults.</p>

        <div className="mt-5 space-y-4">
          <TextField className="flex flex-col gap-1.5" defaultValue="Gandhinagar Depot">
            <Label className="text-xs font-medium text-muted">Depot Name</Label>
            <Input placeholder="Depot name" />
          </TextField>

          <TextField className="flex flex-col gap-1.5" defaultValue="INR (₹)">
            <Label className="text-xs font-medium text-muted">Currency</Label>
            <Input placeholder="Currency" />
          </TextField>

          <TextField className="flex flex-col gap-1.5" defaultValue="Kilometers">
            <Label className="text-xs font-medium text-muted">Distance Unit</Label>
            <Input placeholder="Distance unit" />
          </TextField>

          <Button variant="primary" className="mt-1 w-fit">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* RBAC matrix */}
      <Card className="overflow-hidden border border-border/80 bg-surface/95 p-0 shadow-sm shadow-black/5">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Role-Based Access</h2>
          <p className="mt-1 text-xs text-muted">Which modules each role can reach.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted">Role</th>
                {MODULES.map((m) => (
                  <th key={m.href} className="px-3 py-3 text-center text-xs font-semibold uppercase text-muted">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => (
                <tr key={role} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{ROLE_LABELS[role]}</td>
                  {MODULES.map((m) => (
                    <td key={m.href} className="px-3 py-3 text-center">
                      <AccessCell allowed={canAccess(m, role)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
