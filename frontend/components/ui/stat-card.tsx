"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// KPI stat tile used on Dashboard + Analytics (see mockup stat row).
// TODO: label, big value, optional hint/trend, icon.

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <span>{value}</span>
      {hint ? <span>{hint}</span> : null}
    </div>
  );
}
