// Thin fetch wrapper around the TransitOps NestJS backend.
//
// Expected backend contract (JWT bearer auth):
//   POST /auth/login     { email, password }             -> { accessToken, user }
//   GET  /auth/me        (Authorization: Bearer <token>) -> user
//
// Configure the base URL via NEXT_PUBLIC_API_URL (see .env.local).
import { getToken } from "./session";
import type {
  AuthResponse,
  LoginPayload,
  User,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Attach the bearer token if one is stored. */
  auth?: boolean;
  signal?: AbortSignal;
}

/** Backend list envelope for paginated resources (drivers, fuel, expenses). */
export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

/** Normalise a list response: some endpoints return a bare array, others a
 * `{ data, meta }` envelope. */
export function unwrapList<T>(res: T[] | Paginated<T>): T[] {
  return Array.isArray(res) ? res : (res?.data ?? []);
}

/** Prisma `Decimal` columns serialize to JSON as strings — coerce to number. */
export const toNum = (value: unknown): number =>
  typeof value === "number" ? value : Number(value ?? 0);

/** The backend's Prisma DateTime columns reject date-only strings; always send
 * a full ISO-8601 datetime. */
export const toISO = (value: string | Date): string =>
  new Date(value).toISOString();

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please check your connection and try again.",
      0,
    );
  }

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = extractErrorMessage(data) ?? res.statusText ?? "Request failed";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

/** NestJS error responses look like { message: string | string[], ... }. */
function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const message = (data as { message?: unknown }).message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return null;
}

export const authApi = {
  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });
  },
  me() {
    return apiRequest<User>("/auth/me", { auth: true });
  },
};
