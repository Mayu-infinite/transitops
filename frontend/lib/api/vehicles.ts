// Vehicle API calls. Backend: /vehicles (CRUD + retire). OWNER: Mayuri.
import { apiRequest, toNum, unwrapList, type Paginated } from "../api";
import type { Vehicle, VehicleType } from "../domain";

const coerce = (v: Vehicle): Vehicle => ({
  ...v,
  maxLoadCapacity: toNum(v.maxLoadCapacity),
  odometer: toNum(v.odometer),
  acquisitionCost: toNum(v.acquisitionCost),
});

export function listVehicles(search?: string): Promise<Vehicle[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Vehicle[] | Paginated<Vehicle>>(`/vehicles${q}`, { auth: true })
    .then(unwrapList)
    .then((rows) => rows.map(coerce));
}

export interface CreateVehicleInput {
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
}

export function createVehicle(body: CreateVehicleInput): Promise<Vehicle> {
  return apiRequest<Vehicle>("/vehicles", { method: "POST", body, auth: true });
}

export function retireVehicle(id: string): Promise<Vehicle> {
  return apiRequest<Vehicle>(`/vehicles/${id}`, { method: "DELETE", auth: true });
}
