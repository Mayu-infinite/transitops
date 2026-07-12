"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Generic table used by Fleet/Drivers/Maintenance/Fuel screens.
// TODO: wrap HeroUI Table; columns config, row render, empty state, sorting.
// Suggested API:
//   <DataTable columns={[{ key, header, render }]} rows={data} />

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T>(_props: {
  columns: Column<T>[];
  rows: T[];
}) {
  return null; // scaffold
}
