// TypeScript contracts mirroring the backend DTOs exactly (field names,
// types, nullability) per the v1 frontend integration spec, verified live
// against `developer-2` on 2026-07-10. Phase 1 mocks (`src/mocks/`) and
// hooks (`src/hooks/`) are typed against these so a future switch to real
// `fetch` calls is a compile-time-checked drop-in, not a rewrite.

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice: number | null;
  sku: string;
  stockQuantity: number;
  stockStatus: StockStatus;
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  // ⚠️ The API returns a single hero image only — no images[] array despite
  // the backend entity having a ProductImage[] relation. Do not design a
  // multi-image carousel/gallery for Product Detail.
  primaryImageUrl: string;
  createdAt: string;
};

export type Category = {
  id: number;
  parent: Category | null;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  level: number | null;
  createdAt: string;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  iconUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type MediaType = "IMAGE" | "VIDEO";

// ⚠️ Deliberately has no `uploadedBy` field. The real `GET /api/gallery`
// response embeds the full uploader account (password hash included) and is
// a public, unauthenticated endpoint — a confirmed backend security issue
// (see docs/tasks.md). Only ever read the fields below; never widen this
// type to include `uploadedBy`.
export type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: MediaType;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type Company = {
  id: number;
  name: string;
  description: string;
  vision: string;
  mission: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  updatedAt: string;
};

export type InquiryStatus = "OPEN" | "CLOSED" | "PENDING";
export type InquiryPriority = "LOW" | "NORMAL" | "HIGH";

export type InquiryRequest = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type Inquiry = InquiryRequest & {
  id: number;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string;
};

export type UserRole = "ROLE_USER" | "ROLE_ADMIN";

// Matches `GET /api/profile` (clean DTO, no password field). `GET
// /api/auth/me` additionally leaks a `password` hash field on the backend —
// never type or read that field client-side.
export type Profile = {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
};
