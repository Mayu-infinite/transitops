"use client";

// SHARED PRIMITIVE — OWNER: Mayuri
// Wraps data-driven sections: shows a spinner while loading and an error card
// with retry on failure; otherwise renders children. (Empty state is left to
// DataTable's emptyMessage.)
import { Button, Card, Spinner } from "@heroui/react";

export function QueryState({
  loading,
  error,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center gap-3 border border-red-500/25 bg-red-500/5 p-8 text-center">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Couldn&apos;t load this data
        </p>
        <p className="max-w-md text-xs text-muted">{error}</p>
        {onRetry ? (
          <Button variant="secondary" size="sm" onPress={onRetry}>
            Retry
          </Button>
        ) : null}
      </Card>
    );
  }

  return <>{children}</>;
}
