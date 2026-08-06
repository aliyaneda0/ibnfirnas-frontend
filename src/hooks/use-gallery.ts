import { getGallery } from "@/api/endpoints/gallery";
import type { GalleryItem } from "@/types/api";
import { useApiListQuery } from "./use-api-list-query";

export function useGallery() {
  return useApiListQuery<GalleryItem>(() => getGallery().then((res) => res.data.content));
}
