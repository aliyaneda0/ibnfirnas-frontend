import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, Inquiry, InquiryRequest } from "@/types/api";

export function submitInquiry(request: InquiryRequest, token: string) {
  return apiRequest<ApiEnvelope<Inquiry>>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(request),
    token,
  });
}

export function getMyInquiries(token: string) {
  return apiRequest<ApiEnvelope<Inquiry[]>>("/api/inquiries/my", {
    token,
  });
}
