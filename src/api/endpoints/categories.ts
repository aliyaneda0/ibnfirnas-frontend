import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, Category } from "@/types/api";

export function getCategories() {
  return apiRequest<ApiEnvelope<Category[]>>("/api/categories");
}
