"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// KPI stat tile used on Dashboard + Analytics (see mockup stat row).
import { Card } from "@heroui/react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  /** Tint the value + icon with the brand accent (for headline KPIs). */
  accent?: boolean;
}) {
  return (
    <Card className="h-full border border-border/80 bg-surface/95 p-5 shadow-sm shadow-black/5 transition-colors hover:border-accent/50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-muted">
          {label}
        </span>
        {icon ? (
          <span className={accent ? "text-accent" : "text-muted"}>{icon}</span>
        ) : null}
      </div>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          accent ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Card>
  );
}
