// Shared formatting helpers.

/** Format an ISO date string as e.g. "03 Dec 2027" (— when absent). */
export const fmtDate = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";


/** Format a number as Indian Rupees with no decimals, e.g. 34070 -> "₹34,070". */
export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
