// Shared shape returned by every read hook in this folder — matches what
// React Query's `useQuery` returns.
export type QueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};
