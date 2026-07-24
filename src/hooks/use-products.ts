import { useMemo } from "react";

import { mockProducts } from "@/mocks/products";
import type { Product } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

export function useProducts() {
  return useMockQuery<Product[]>(() => mockProducts);
}

export function useFeaturedProducts() {
  return useMockQuery<Product[]>(() => mockProducts.filter((p) => p.isFeatured));
}

export function useProduct(id: string | number | undefined) {
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);
  return useMockQuery<Product | null>(
    () => mockProducts.find((p) => p.id === numericId) ?? null,
  );
}
