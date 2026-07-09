import { useCallback, useEffect, useState } from "react";

// Shared shape behind every read hook in this folder — matches what
// React Query's `useQuery` returns, so swapping the body for a real `fetch`
// later (Phase 2) doesn't require touching any screen component.
export type MockQueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const MOCK_DELAY_MS = 350;

export function useMockQuery<T>(resolve: () => T): MockQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      try {
        setData(resolve());
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, MOCK_DELAY_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => load(), [load]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, isLoading, error, refetch };
}
