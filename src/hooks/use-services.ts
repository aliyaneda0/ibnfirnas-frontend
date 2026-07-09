import { useMemo } from "react";

import { mockServices } from "@/mocks/services";
import type { Service } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

export function useServices() {
  return useMockQuery<Service[]>(() => mockServices);
}

export function useFeaturedServices() {
  return useMockQuery<Service[]>(() => mockServices.filter((s) => s.isFeatured));
}

export function useService(id: string | number | undefined) {
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);
  return useMockQuery<Service | null>(
    () => mockServices.find((s) => s.id === numericId) ?? null,
  );
}
