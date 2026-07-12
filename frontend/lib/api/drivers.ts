// Driver API calls. Backend: /drivers (CRUD + status). OWNER: Saichandana.
import { apiRequest, toISO, unwrapList, type Paginated } from "../api";
import type { Driver, DriverStatus } from "../domain";

export function listDrivers(params?: {
  status?: DriverStatus;
  search?: string;
}): Promise<Driver[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const q = qs.toString();
  return apiRequest<Driver[] | Paginated<Driver>>(`/drivers${q ? `?${q}` : ""}`, {
    auth: true,
  }).then(unwrapList);
}

export interface CreateDriverInput {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO date
  contactNumber: string;
  safetyScore?: number;
  status?: DriverStatus;
}

export function createDriver(body: CreateDriverInput): Promise<Driver> {
  return apiRequest<Driver>("/drivers", {
    method: "POST",
    body: { ...body, licenseExpiry: toISO(body.licenseExpiry) },
    auth: true,
  });
}

export function updateDriver(
  id: string,
  body: Partial<CreateDriverInput> & { status?: DriverStatus },
): Promise<Driver> {
  return apiRequest<Driver>(`/drivers/${id}`, { method: "PATCH", body, auth: true });
}
