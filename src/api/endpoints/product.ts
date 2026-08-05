import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, PaginatedResponse, Product } from "@/types/api";

export function getProducts() {
  return apiRequest<ApiEnvelope<PaginatedResponse<Product>>>("/api/products");
}

export function getFeaturedProducts() {
  return apiRequest<ApiEnvelope<Product[]>>("/api/products/featured");
}

export function getProduct(id: number) {
  return apiRequest<ApiEnvelope<Product>>(`/api/products/${id}`);
}
