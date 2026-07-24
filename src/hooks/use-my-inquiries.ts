import { useMemo } from "react";

import { mockInquiries } from "@/mocks/inquiries";
import type { Inquiry } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

// No `userId` on `Inquiry` (matches the real DTO — ownership is enforced
// server-side via the auth token, not a response field), so the mock layer
// approximates "the signed-in user's inquiries" by matching submitter email.
function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() || null;
}

export function useMyInquiries(email: string | null | undefined) {
  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  return useMockQuery<Inquiry[]>(() =>
    normalizedEmail
      ? mockInquiries.filter((inquiry) => inquiry.email.trim().toLowerCase() === normalizedEmail)
      : [],
  );
}

export function useInquiry(id: string | number | undefined, email: string | null | undefined) {
  const numericId = useMemo(() => (id !== undefined ? Number(id) : NaN), [id]);
  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  return useMockQuery<Inquiry | null>(() => {
    const inquiry = mockInquiries.find((item) => item.id === numericId) ?? null;
    if (!inquiry || !normalizedEmail || inquiry.email.trim().toLowerCase() !== normalizedEmail) {
      return null;
    }
    return inquiry;
  });
}
