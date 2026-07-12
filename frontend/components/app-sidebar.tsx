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
    <div className="flex h-full flex-col bg-accent text-white">
      <div className="flex h-16 items-center border-b border-white/15 px-5">
        <Logo onAccent />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-white/55">
          Menu
        </p>
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
                "relative rounded-[8px] px-3.5 py-3 text-[15px] font-medium transition-colors",
                active
                  ? "bg-white text-accent shadow-sm"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-[8px] bg-accent" />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 p-4">
        <p className="text-xs text-white/55">TransitOps · v0.1</p>
      </div>
    </div>
  );
}
