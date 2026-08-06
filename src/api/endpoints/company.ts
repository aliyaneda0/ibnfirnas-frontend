// about/mission/contact info

import { apiRequest } from "@/api/http-client";
import type { ApiEnvelope, Company } from "@/types/api";

export function getCompany() {
  return apiRequest<ApiEnvelope<Company | null>>("/api/company");
}
