// Shared domain types for TransitOps.

/**
 * User roles. Values are the canonical enum strings expected from the backend
 * (Prisma `Role` enum). Keep these in sync with the NestJS API.
 */
export type Role =
  | "FLEET_MANAGER"
  | "DRIVER"
  | "SAFETY_OFFICER"
  | "FINANCIAL_ANALYST";

export const ROLES: Role[] = [
  "FLEET_MANAGER",
  "DRIVER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
];

/** Human-readable labels for each role. */
export const ROLE_LABELS: Record<Role, string> = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

/** Short description of what each role is responsible for. */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  FLEET_MANAGER: "Oversees fleet assets, maintenance, and vehicle lifecycle.",
  DRIVER: "Creates trips, assigns vehicles, and monitors deliveries.",
  SAFETY_OFFICER: "Tracks driver compliance, licenses, and safety scores.",
  FINANCIAL_ANALYST: "Reviews expenses, fuel, maintenance costs, and ROI.",
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}
