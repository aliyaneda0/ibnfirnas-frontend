import { useCallback, useEffect, useState } from "react";

import type { MockQueryResult } from "./use-mock-query";

// Single-object counterpart to `useApiListQuery` — same result shape as
// `useMockQuery` so screens don't change when a hook swaps from mock data
// to a real fetch. Used for endpoints that return one object (or null),
// not a list: GET /api/products/{id}, /api/services/{id}, /api/company.
export function useApiQuery<T>(fetcher: () => Promise<T>): MockQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => load(), [load]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, isLoading, error, refetch };
}
