import { useMemo } from "react";

import { getFeaturedServices, getService, getServices } from "@/api/endpoints/services";
import type { Service } from "@/types/api";
import { useApiListQuery } from "./use-api-list-query";
import { useApiQuery } from "./use-api-query";

export function useServices() {
  return useApiListQuery<Service>(() => getServices().then((res) => res.data.content));
}

export function useFeaturedServices() {
  return useApiListQuery<Service>(() => getFeaturedServices().then((res) => res.data));
}

export function useService(id: string | number | undefined) {
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);
  return useApiQuery<Service | null>(() =>
    Number.isNaN(numericId) ? Promise.resolve(null) : getService(numericId).then((res) => res.data),
  );
}
