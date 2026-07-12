"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Coloured status pill used by every table (see mockup badges).
// TODO: map BadgeTone -> HeroUI Chip / token classes
//   success=green, info=blue, warning=amber, danger=red, neutral=gray.
import type { BadgeTone } from "@/lib/domain";

export function StatusBadge({
  tone,
  label,
}: {
  tone: BadgeTone;
  label: string;
}) {
  // Placeholder styling — replace with the final design.
  return (
    <span className="rounded-md px-2 py-0.5 text-xs font-medium" data-tone={tone}>
      {label}
    </span>
  );
}
