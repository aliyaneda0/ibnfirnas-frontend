import { useCallback, useState } from "react";

import { submitInquiry } from "@/api/endpoints/inquiries";
import { useAuth } from "@/features/auth/auth-provider";
import type { Inquiry, InquiryRequest } from "@/types/api";

export function useSubmitInquiry() {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (request: InquiryRequest): Promise<Inquiry> => {
      if (!token) {
        const err = new Error("You must be logged in to submit an inquiry");
        setError(err);
        throw err;
      }
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await submitInquiry(request, token);
        return response.data;
      } catch (e) {
        setError(e as Error);
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token],
  );

  return { submit, isSubmitting, error };
}
