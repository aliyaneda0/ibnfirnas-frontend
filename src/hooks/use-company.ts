import { mockCompany } from "@/mocks/company";
import type { Company } from "@/types/api";
import { useMockQuery } from "./use-mock-query";

export function useCompany() {
  return useMockQuery<Company>(() => mockCompany);
}
