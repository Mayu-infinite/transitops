"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Generic sortable table used across Fleet/Drivers/Maintenance/Fuel screens.
//   <DataTable columns={[{ key, header, render, align, sortable, sortValue }]} rows={data} />
// Click a column header to sort (asc → desc → off). Columns are sortable by
// default; pass `sortable: false` to disable, or `sortValue` for custom keys.
import { useMemo, useState } from "react";
import { Card } from "@heroui/react";
import type React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
  /** Set false to disable sorting on this column. */
  sortable?: boolean;
  /** Value used for sorting (defaults to row[key]). */
  sortValue?: (row: T) => string | number;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

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
  const [sort, setSort] = useState<SortState>(null);

  const alignClass = (a?: Column<T>["align"]) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";
  const readCell = (row: T, key: string) =>
    (row as Record<string, unknown>)[key];

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const valueOf = (row: T): string | number => {
      if (col.sortValue) return col.sortValue(row);
      const raw = readCell(row, col.key);
      return typeof raw === "number" ? raw : String(raw ?? "");
    };
    return [...rows].sort((a, b) => {
      const av = valueOf(a);
      const bv = valueOf(b);
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  const toggleSort = (key: string) =>
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });

  return (
    <Card className="overflow-hidden border border-border/80 bg-surface/95 p-0 shadow-sm shadow-black/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/70">
              {columns.map((col) => {
                const isSortable = col.sortable !== false;
                const activeDir = sort?.key === col.key ? sort.dir : undefined;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-semibold uppercase text-muted ${alignClass(col.align)}`}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={`inline-flex items-center gap-1 uppercase transition-colors hover:text-foreground ${
                          col.align === "right" ? "flex-row-reverse" : ""
                        } ${activeDir ? "text-foreground" : ""}`}
                      >
                        {col.header}
                        <SortArrow dir={activeDir} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, i) => (
                <tr
                  key={getRowKey ? getRowKey(row, i) : i}
                  className="border-b border-border/60 last:border-0 transition-colors hover:bg-accent-soft/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-foreground ${alignClass(col.align)}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(readCell(row, col.key) ?? "—")}
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

function SortArrow({ dir }: { dir?: "asc" | "desc" }) {
  return (
    <span className="inline-flex flex-col leading-none text-[8px]">
      <span className={dir === "asc" ? "text-accent" : "text-muted/40"}>▲</span>
      <span className={dir === "desc" ? "text-accent" : "text-muted/40"}>▼</span>
    </span>
  );
}
