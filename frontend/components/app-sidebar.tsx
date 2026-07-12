"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { navForRole } from "@/lib/rbac";
import type { Role } from "@/lib/types";

export function AppSidebar({
  role,
  onNavigate,
}: {
  role: Role | undefined;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = navForRole(role);

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 px-2">
        <Logo />
      </div>

      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent-soft-foreground"
                : "text-muted hover:bg-surface-secondary hover:text-foreground",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
