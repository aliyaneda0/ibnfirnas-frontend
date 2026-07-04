import { apiRequest } from "@/api/http-client";

export type LoginPayload = {
  email?: string;
  phone?: string;
  countryCode?: "+974" | "+91";
};

export type LoginResponse = {
  token: string;
};

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
