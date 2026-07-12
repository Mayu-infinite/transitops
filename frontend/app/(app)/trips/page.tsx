"use client";

// ─────────────────────────────────────────────────────────────────────────
// Screen 4 · Trip Dispatcher                    OWNER: Mayuri
// Mockup: "4. Trip Dispatcher"
// TODO: lifecycle stepper (Draft→Dispatched→Completed→Cancelled) · Create Trip
//       form (source, destination, available vehicle/driver only, cargo weight,
//       planned distance) · Live Board. Rules: cargo ≤ capacity; dispatch flips
//       vehicle+driver to On Trip; complete/cancel restores to Available.
// ─────────────────────────────────────────────────────────────────────────

export default function TripsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Trips</h1>
      <p className="mt-1 text-muted">Trip dispatcher — scaffold, not yet built.</p>
    </div>
  );
}
