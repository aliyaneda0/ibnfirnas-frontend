import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, PaginatedResponse, Service } from "@/types/api";

export function getServices() {
  return apiRequest<ApiEnvelope<PaginatedResponse<Service>>>("/api/services");
}

export function getFeaturedServices() {
  return apiRequest<ApiEnvelope<Service[]>>("/api/services/featured");
}

export function getService(id: number) {
  return apiRequest<ApiEnvelope<Service>>(`/api/services/${id}`);
}
