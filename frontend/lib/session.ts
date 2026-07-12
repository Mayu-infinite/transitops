// Client-side session persistence.
//
// The access token is kept in BOTH a cookie and localStorage:
//   - the cookie lets `proxy.ts` do an optimistic redirect on the server before
//     a protected page renders (no token cookie -> bounce to /login);
//   - localStorage holds the token + cached user for the client AuthProvider.
//
// The token here is a bearer JWT issued by the backend and read by JS, so it is
// intentionally NOT httpOnly. The backend remains the source of truth and must
// enforce authorization on every request.
import type { User } from "./types";

export const TOKEN_COOKIE = "transitops_token";
const TOKEN_KEY = "transitops.token";
const USER_KEY = "transitops.user";

const isBrowser = () => typeof window !== "undefined";

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (!isBrowser()) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/** Persist a full session (called on login/register success). */
export function saveSession(token: string, user: User) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  // 7 days — matches a typical backend JWT lifetime.
  setCookie(TOKEN_COOKIE, token, 60 * 60 * 24 * 7);
}

/** Update just the cached user (e.g. after refreshing the profile). */
export function saveUser(user: User) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Clear everything (logout / expired token). */
export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  deleteCookie(TOKEN_COOKIE);
}
