"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SearchField, Spinner } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/app-sidebar";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Protected application shell: sidebar + top bar around the routed page.
 * Unauthenticated users are redirected to /login.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-dvh overflow-y-auto">
          <AppSidebar role={user.role} />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <AppSidebar
              role={user.role}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="lg:hidden"
            aria-label="Open navigation"
            onPress={() => setMobileNavOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>

          {/* Search */}
          <SearchField aria-label="Search" className="w-full max-w-md">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
