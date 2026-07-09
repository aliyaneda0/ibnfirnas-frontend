import { mockGallery } from "@/mocks/gallery";
import type { GalleryItem } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

export function useGallery() {
  return useMockQuery<GalleryItem[]>(() => mockGallery);
}
