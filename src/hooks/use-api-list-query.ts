import { useCallback, useEffect, useState } from "react";

import type { QueryResult } from "./query-result";

// Only used for the three endpoints that return a paginated envelope
// (`{ data: { content: [...] } }`): GET /api/products, /api/services,
// /api/gallery.
export function useApiListQuery<T>(fetcher: () => Promise<T[]>): QueryResult<T[]> {
  const [data, setData] = useState<T[] | null>(null);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return load();
  }, [load]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, isLoading, error, refetch };
}
