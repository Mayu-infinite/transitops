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

export interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
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
    const message =
      extractErrorMessage(data) ??
      res.statusText ??
      "Request failed";

    throw new ApiError(message, res.status);
  }

  return data as T;
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const message = (data as { message?: unknown }).message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Shared HTTP helpers for feature APIs                                       */
/* -------------------------------------------------------------------------- */

export const api = {
  get<T>(path: string, auth = true) {
    return request<T>(path, { auth });
  },

  post<T>(path: string, body: unknown, auth = true) {
    return request<T>(path, {
      method: "POST",
      body,
      auth,
    });
  },

  patch<T>(path: string, body: unknown, auth = true) {
    return request<T>(path, {
      method: "PATCH",
      body,
      auth,
    });
  },

  delete<T>(path: string, auth = true) {
    return request<T>(path, {
      method: "DELETE",
      auth,
    });
  },
};

export const authApi = {
  login(payload: LoginPayload) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  me() {
    return request<User>("/auth/me", {
      auth: true,
    });
  },
};