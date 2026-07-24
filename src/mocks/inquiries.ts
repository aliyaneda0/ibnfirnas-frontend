import type { Inquiry } from "@/types/api";

// No backend yet — inquiries submitted via the app are appended here so
// "My Inquiries" has something to list. Lives only for the app session,
// same as every other mock data source in this folder.
export const mockInquiries: Inquiry[] = [];

export function addMockInquiry(inquiry: Inquiry) {
  mockInquiries.unshift(inquiry);
}
