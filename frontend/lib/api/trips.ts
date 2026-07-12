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

export interface CreateTripInput {
  vehicleId: string;
  driverId: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  createdBy: string;
}

export function createTrip(body: CreateTripInput): Promise<Trip> {
  return apiRequest<Trip>("/trips", {
    method: "POST",
    body,
    auth: true,
  }).then((trip) => ({ ...trip, revenue: trip.revenue != null ? toNum(trip.revenue) : undefined }));
}

export function dispatchTrip(id: string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/dispatch`, {
    method: "POST",
    auth: true,
  }).then((trip) => ({ ...trip, revenue: trip.revenue != null ? toNum(trip.revenue) : undefined }));
}

export function completeTrip(id: string, actualDistance: number, finalOdometer: number): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/complete`, {
    method: "POST",
    body: { actualDistance, finalOdometer },
    auth: true,
  }).then((trip) => ({ ...trip, revenue: trip.revenue != null ? toNum(trip.revenue) : undefined }));
}

export function cancelTrip(id: string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/cancel`, {
    method: "POST",
    auth: true,
  }).then((trip) => ({ ...trip, revenue: trip.revenue != null ? toNum(trip.revenue) : undefined }));
}
