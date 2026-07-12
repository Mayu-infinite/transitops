// Shared domain entities + status enums for TransitOps.
// SHARED FILE — both Mayuri and Saichandana import from here so entity shapes
// and status colours stay consistent. Coordinate before changing existing types.

// ── Status unions (match the spec / mockup badges) ──────────────────────────
export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "ON_LEAVE" | "TERMINATED";
export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
export type MaintenanceStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED";
export type VehicleType =
  | "VAN"
  | "TRUCK"
  | "BUS"
  | "MOTORCYCLE"
  | "PICKUP"
  | "TRAILER"
  | "OTHER";
export type ExpenseType = "TOLL" | "INSURANCE" | "OTHER";

// ── Badge tones (map a status -> a colour used by <StatusBadge>) ────────────
export type BadgeTone = "success" | "info" | "warning" | "danger" | "neutral";

export const VEHICLE_STATUS_TONE: Record<VehicleStatus, BadgeTone> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  IN_SHOP: "warning",
  RETIRED: "danger",
};
export const DRIVER_STATUS_TONE: Record<DriverStatus, BadgeTone> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  ON_LEAVE: "neutral",
  TERMINATED: "danger",
};
export const TRIP_STATUS_TONE: Record<TripStatus, BadgeTone> = {
  DRAFT: "neutral",
  DISPATCHED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};
export const MAINTENANCE_STATUS_TONE: Record<MaintenanceStatus, BadgeTone> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};

// ── Entities ────────────────────────────────────────────────────────────────
export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance?: number;
  revenue?: number;
  status: TripStatus;
  dispatchedAt?: string;
  completedAt?: string;
  createdAt?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  description: string;
  cost: number;
  startDate: string;
  endDate?: string;
  status: MaintenanceStatus;
  createdAt?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  odometer: number;
  fuelDate: string;
  createdAt?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  description: string;
  expenseDate: string;
  createdAt?: string;
}
