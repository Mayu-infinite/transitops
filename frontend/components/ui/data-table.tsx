"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Generic table used across Fleet/Drivers/Maintenance/Fuel screens.
//   <DataTable columns={[{ key, header, render, align }]} rows={data} />
import { Card } from "@heroui/react";
import type React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends object>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No records yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => string | number;
  emptyMessage?: string;
}) {
  const alignClass = (a?: Column<T>["align"]) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";
  const readCell = (row: T, key: string) =>
    String((row as Record<string, unknown>)[key] ?? "—");

  return (
    <Card className="overflow-hidden border border-border/80 bg-surface/95 p-0 shadow-sm shadow-black/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase text-muted ${alignClass(
                    col.align,
                  )}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={getRowKey ? getRowKey(row, i) : i}
                  className="border-b border-border/60 last:border-0 transition-colors hover:bg-accent-soft/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-foreground ${alignClass(col.align)}`}
                    >
                      {col.render ? col.render(row) : readCell(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
