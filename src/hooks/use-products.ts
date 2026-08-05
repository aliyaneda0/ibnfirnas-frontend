import { useMemo } from "react";

import { getFeaturedProducts, getProduct, getProducts } from "@/api/endpoints/product";
import type { Product } from "@/types/api";
import { useApiListQuery } from "./use-api-list-query";
import { useApiQuery } from "./use-api-query";

export function useProducts() {
  return useApiListQuery<Product>(() => getProducts().then((res) => res.data.content));
}

export function useFeaturedProducts() {
  return useApiListQuery<Product>(() => getFeaturedProducts().then((res) => res.data));
}

export function useProduct(id: string | number | undefined) {
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);
  return useApiQuery<Product | null>(() =>
    Number.isNaN(numericId) ? Promise.resolve(null) : getProduct(numericId).then((res) => res.data),
  );
}
