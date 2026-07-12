"use client";
// ─────────────────────────────────────────────────────────────────────────
// Screen 3 · Drivers & Safety Profiles          OWNER: Saichandana
// Mockup: "3. Drivers & Safety Profiles"
// TODO: Add Driver · table (name, license no, category, expiry, contact, trip
//       compl., safety score, status badge) · status toggle (Available/On Trip/
//       Off Duty/Suspended). Rule: expired license OR Suspended -> blocked from
//       trip assignment.
// ─────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { DriversTable } from "@/components/drivers/drivers-table";

export default function DriversPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Drivers &amp; Safety Profiles
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage driver profiles and safety records.
          </p>
        </div>

        <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          + Add Driver
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search drivers..."
        className="w-full rounded-lg border px-4 py-2"
      />

      <DriversTable search={search} />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Toggle Status</p>

        <div className="flex flex-wrap gap-3">
          <button className="rounded bg-green-500 px-4 py-2 text-white">
            Available
          </button>

          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            On Trip
          </button>

          <button className="rounded bg-gray-400 px-4 py-2 text-white">
            Off Duty
          </button>

          <button className="rounded bg-orange-500 px-4 py-2 text-white">
            Suspended
          </button>
        </div>

        <p className="text-sm text-orange-600">
          Rule: Expired license or Suspended status → blocked from trip
          assignment.
        </p>
      </div>
    </div>
  );
}