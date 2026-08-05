import { useMemo } from "react";

import { getMyInquiries } from "@/api/endpoints/inquiries";
import { useAuth } from "@/features/auth/auth-provider";
import type { Inquiry } from "@/types/api";
import { useApiListQuery } from "./use-api-list-query";
import { useApiQuery } from "./use-api-query";

// `email` is accepted for backward compatibility with existing call sites,
// but ownership is enforced server-side via the auth token (GET /api/inquiries/my
// already scopes to the caller), so it isn't used to filter here.
export function useMyInquiries(_email?: string | null) {
  const { token } = useAuth();
  return useApiListQuery<Inquiry>(() =>
    token ? getMyInquiries(token).then((res) => res.data) : Promise.resolve([]),
  );
}

// No single-item "my inquiry by id" endpoint exists server-side, so this
// fetches the caller's full list (same as useMyInquiries) and finds the
// matching id client-side.
export function useInquiry(id: string | number | undefined, _email?: string | null) {
  const { token } = useAuth();
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);

  return useApiQuery<Inquiry | null>(() => {
    if (!token || Number.isNaN(numericId)) return Promise.resolve(null);
    return getMyInquiries(token).then(
      (res) => res.data.find((inquiry) => inquiry.id === numericId) ?? null,
    );
  });
}
