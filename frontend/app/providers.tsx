"use client";

// Client-side context providers wrapped around the whole app. HeroUI v3 needs
// no provider of its own, so this is just our theme + auth state.
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
