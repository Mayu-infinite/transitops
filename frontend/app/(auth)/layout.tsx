"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Spinner } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from "@/lib/types";

/**
 * Two-panel authentication layout: a branded showcase on the left and the
 * sign-in form on the right. Signed-in users are redirected
 * to the dashboard.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-surface-secondary p-6 text-foreground lg:flex lg:flex-col xl:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90 [background:linear-gradient(145deg,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_42%),radial-gradient(70%_50%_at_10%_0%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
        />

        <div className="relative z-10 flex h-full flex-col">
          <Logo size="lg" />

          <div className="mt-auto max-w-full">
            <h2 className="text-3xl font-semibold leading-tight xl:text-4xl">
              Smart transport operations, secured by role.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Sign in once to manage vehicles, drivers, dispatch, maintenance,
              expenses, and analytics with RBAC-aware navigation.
            </p>

            <Card className="mt-10 rounded-none border border-border/80 bg-background/60 p-5 shadow-sm shadow-black/5">
              <p className="text-xs font-semibold uppercase text-muted">
                One login, four operating roles
              </p>
              <ul className="mt-4 space-y-3">
                {ROLES.map((role) => (
                  <li key={role} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>
                      <span className="text-sm font-medium text-foreground">
                        {ROLE_LABELS[role]}
                      </span>
                      <span className="ml-2 text-sm text-muted">
                        {ROLE_DESCRIPTIONS[role]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <p className="relative z-10 mt-10 text-xs text-muted">
            © 2026 TransitOps · RBAC enabled
          </p>
        </div>
      </aside>

      {/* Right · form */}
      <main className="relative flex flex-col bg-background">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10">
          <div className="w-full max-w-[38rem]">{children}</div>
        </div>
      </main>
    </div>
  );
}
