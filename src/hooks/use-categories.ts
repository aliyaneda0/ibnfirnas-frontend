import { getCategories } from "@/api/endpoints/categories";
import type { Category } from "@/types/api";
import { useApiListQuery } from "./use-api-list-query";

export function useCategories() {
  return useApiListQuery<Category>(() => getCategories().then((res) => res.data));
}
