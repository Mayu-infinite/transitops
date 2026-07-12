"use client";

// Small client-side data-fetching hook for the app screens. Handles loading /
// error state, aborts in-flight requests on unmount or dependency change, and
// exposes `reload()` for manual refetch after a mutation.
import { useEffect, useRef, useState } from "react";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useApiData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetcherRef.current(controller.signal).then(
      (result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      },
      (err: unknown) => {
        if (!active || (err instanceof Error && err.name === "AbortError")) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      },
    );

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
