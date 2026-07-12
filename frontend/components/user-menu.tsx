"use client";

import { Button } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS } from "@/lib/types";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium leading-tight">{user.name}</p>
        <p className="text-xs text-muted">{ROLE_LABELS[user.role]}</p>
      </div>
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
        aria-hidden="true"
      >
        {initials(user.name)}
      </div>
      <Button variant="outline" size="sm" onPress={logout}>
        Sign out
      </Button>
    </div>
  );
}
