// Maintenance API calls. Backend: /maintenance (CRUD + close). OWNER: Saichandana.
// Creating a record moves the vehicle to IN_SHOP; closing restores availability.
import { apiRequest, toISO, toNum, unwrapList, type Paginated } from "../api";
import type { MaintenanceRecord, MaintenanceStatus } from "../domain";

const coerce = (m: MaintenanceRecord): MaintenanceRecord => ({
  ...m,
  cost: toNum(m.cost),
});

export function listMaintenance(params?: {
  status?: MaintenanceStatus;
  vehicleId?: string;
}): Promise<MaintenanceRecord[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.vehicleId) qs.set("vehicleId", params.vehicleId);
  const q = qs.toString();
  return apiRequest<MaintenanceRecord[] | Paginated<MaintenanceRecord>>(
    `/maintenance${q ? `?${q}` : ""}`,
    { auth: true },
  )
    .then(unwrapList)
    .then((rows) => rows.map(coerce));
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  description: string;
  cost: number;
  startDate: string; // ISO date
  status?: MaintenanceStatus;
}

export function createMaintenance(body: CreateMaintenanceInput): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>("/maintenance", {
    method: "POST",
    body: { ...body, startDate: toISO(body.startDate) },
    auth: true,
  });
}

export function closeMaintenance(id: string): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/maintenance/${id}/close`, {
    method: "PATCH",
    auth: true,
  });
}
