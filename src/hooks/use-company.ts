import { getCompany } from "@/api/endpoints/company";
import type { Company } from "@/types/api";
import { useApiQuery } from "./use-api-query";

export function useCompany() {
  return useApiQuery<Company | null>(() => getCompany().then((res) => res.data));
}
