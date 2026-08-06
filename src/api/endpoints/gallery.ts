import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, GalleryItem, PaginatedResponse } from "@/types/api";

export function getGallery() {
  return apiRequest<ApiEnvelope<PaginatedResponse<GalleryItem>>>("/api/gallery");
}
