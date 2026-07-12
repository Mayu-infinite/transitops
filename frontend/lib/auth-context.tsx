"use client";

// Client-side authentication state. Holds the signed-in user, exposes
// login/logout, and hydrates from the stored session on mount.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, authApi } from "./api";
import {
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
  saveUser,
} from "./session";
import type { LoginPayload, User } from "./types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Hydrate from storage on first mount, then refresh the profile in the
  // background so a revoked/expired token gets cleared.
  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const token = getToken();
      const stored = getStoredUser();

      if (!token || !stored) {
        setStatus("unauthenticated");
        return;
      }

      setUser(stored);
      setStatus("authenticated");

      authApi
        .me()
        .then((fresh) => {
          if (cancelled) return;
          setUser(fresh);
          saveUser(fresh);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          // Only sign out on a real auth rejection; keep the session on network
          // errors so the app still works while the backend is unavailable.
          if (
            err instanceof ApiError &&
            (err.status === 401 || err.status === 403)
          ) {
            clearSession();
            setUser(null);
            setStatus("unauthenticated");
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { accessToken, user: loggedIn } = await authApi.login(payload);
    saveSession(accessToken, loggedIn);
    setUser(loggedIn);
    setStatus("authenticated");
    return loggedIn;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
