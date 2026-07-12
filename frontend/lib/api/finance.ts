// Fuel & Expense API calls. Backend: /fuel-expenses/{fuel,expenses}. OWNER: Saichandana.
import { apiRequest, toISO, toNum, unwrapList, type Paginated } from "../api";
import type { Expense, ExpenseType, FuelLog } from "../domain";

export function listFuelLogs(vehicleId?: string): Promise<FuelLog[]> {
  const q = vehicleId ? `?vehicleId=${encodeURIComponent(vehicleId)}` : "";
  return apiRequest<FuelLog[] | Paginated<FuelLog>>(`/fuel-expenses/fuel${q}`, { auth: true })
    .then(unwrapList)
    .then((rows) => rows.map((r) => ({ ...r, cost: toNum(r.cost) })));
}

export function listExpenses(vehicleId?: string): Promise<Expense[]> {
  const q = vehicleId ? `?vehicleId=${encodeURIComponent(vehicleId)}` : "";
  return apiRequest<Expense[] | Paginated<Expense>>(`/fuel-expenses/expenses${q}`, { auth: true })
    .then(unwrapList)
    .then((rows) => rows.map((r) => ({ ...r, amount: toNum(r.amount) })));
}

export interface CreateFuelLogInput {
  vehicleId: string;
  liters: number;
  cost: number;
  odometer: number;
  fuelDate: string; // ISO date
}

export function createFuelLog(body: CreateFuelLogInput): Promise<FuelLog> {
  return apiRequest<FuelLog>("/fuel-expenses/fuel", {
    method: "POST",
    body: { ...body, fuelDate: toISO(body.fuelDate) },
    auth: true,
  });
}

export interface CreateExpenseInput {
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  description?: string;
  expenseDate: string; // ISO date
}

export function createExpense(body: CreateExpenseInput): Promise<Expense> {
  return apiRequest<Expense>("/fuel-expenses/expenses", {
    method: "POST",
    body: { ...body, expenseDate: toISO(body.expenseDate) },
    auth: true,
  });
}
