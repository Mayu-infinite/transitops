// Role-based access control: navigation map + permission helpers.
import type { Role } from "./types";

export interface NavItem {
  /** Route path. */
  href: string;
  /** Sidebar label. */
  label: string;
  /** Roles allowed to see/access this item. Empty = every authenticated user. */
  roles?: Role[];
}

/**
 * Application navigation. Each entry is gated by role; the app shell filters
 * this list against the signed-in user's role. These mirror the modules in the
 * TransitOps spec (dashboard, vehicles, drivers, trips, maintenance, finance).
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  {
    href: "/vehicles",
    label: "Vehicles",
    roles: ["FLEET_MANAGER", "DRIVER", "FINANCIAL_ANALYST"],
  },
  {
    href: "/drivers",
    label: "Drivers",
    roles: ["FLEET_MANAGER", "SAFETY_OFFICER"],
  },
  {
    href: "/trips",
    label: "Trips",
    roles: ["DRIVER", "FLEET_MANAGER"],
  },
  {
    href: "/maintenance",
    label: "Maintenance",
    roles: ["FLEET_MANAGER"],
  },
  {
    href: "/finance",
    label: "Fuel & Expenses",
    roles: ["FINANCIAL_ANALYST", "FLEET_MANAGER"],
  },
  {
    href: "/reports",
    label: "Reports",
    roles: ["FINANCIAL_ANALYST", "FLEET_MANAGER", "SAFETY_OFFICER"],
  },
];

/** Whether a role may access an item (undefined role = not allowed). */
export function canAccess(item: NavItem, role: Role | undefined): boolean {
  if (!item.roles || item.roles.length === 0) return true;
  return role !== undefined && item.roles.includes(role);
}

/** Nav items visible to a given role. */
export function navForRole(role: Role | undefined): NavItem[] {
  return NAV_ITEMS.filter((item) => canAccess(item, role));
}
