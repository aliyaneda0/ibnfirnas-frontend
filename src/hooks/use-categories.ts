import { mockCategories } from "@/mocks/categories";
import type { Category } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

export function useCategories() {
  return useMockQuery<Category[]>(() => mockCategories);
}
