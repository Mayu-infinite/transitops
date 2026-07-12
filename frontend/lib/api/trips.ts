// Trip API calls. Backend: /trips (CRUD + dispatch/complete/cancel). OWNER: Mayuri.
import { apiRequest, toNum, unwrapList, type Paginated } from "../api";
import type { Trip, TripStatus } from "../domain";

export interface TripCounts {
  total: number;
  draft: number;
  dispatched: number;
  completed: number;
  cancelled: number;
}

export function getTripCounts(): Promise<TripCounts> {
  return apiRequest<TripCounts>("/trips/counts", { auth: true });
}

export function listTrips(status?: TripStatus): Promise<Trip[]> {
  const q = status ? `?status=${status}` : "";
  return apiRequest<Trip[] | Paginated<Trip>>(`/trips${q}`, { auth: true })
    .then(unwrapList)
    .then((rows) => rows.map((t) => ({ ...t, revenue: t.revenue != null ? toNum(t.revenue) : undefined })));
}
