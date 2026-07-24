import { useCallback, useState } from "react";

import { addMockInquiry } from "@/mocks/inquiries";
import type { Inquiry, InquiryRequest } from "@/types/api";

const SUBMIT_DELAY_MS = 500;
let mockInquiryId = 100;

export function useSubmitInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback((request: InquiryRequest): Promise<Inquiry> => {
    setIsSubmitting(true);
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsSubmitting(false);
        if (!request.name.trim() || !request.email.trim() || !request.subject.trim() || !request.message.trim()) {
          const err = new Error("name, email, subject, and message are required");
          setError(err);
          reject(err);
          return;
        }
        const inquiry: Inquiry = {
          ...request,
          id: mockInquiryId++,
          status: "OPEN",
          priority: "NORMAL",
          createdAt: new Date().toISOString(),
        };
        addMockInquiry(inquiry);
        resolve(inquiry);
      }, SUBMIT_DELAY_MS);
    });
  }, []);

  return { submit, isSubmitting, error };
}
