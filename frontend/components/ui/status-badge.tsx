"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Coloured status pill used by every table (see mockup badges).
import type { BadgeTone } from "@/lib/domain";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success:
    "bg-emerald-500/15 text-emerald-600 ring-emerald-500/25 dark:text-emerald-400",
  info: "bg-sky-500/15 text-sky-600 ring-sky-500/25 dark:text-sky-400",
  warning: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-400",
  danger: "bg-red-500/15 text-red-600 ring-red-500/25 dark:text-red-400",
  neutral: "bg-zinc-500/15 text-zinc-600 ring-zinc-500/25 dark:text-zinc-400",
};

export function StatusBadge({
  tone,
  label,
}: {
  tone: BadgeTone;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
