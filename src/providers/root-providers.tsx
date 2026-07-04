import { AuthProvider } from "@/features/auth/auth-provider";
import { LanguageProvider } from "@/i18n/i18n-provider";
import { PropsWithChildren } from "react";

export function RootProviders({ children }: PropsWithChildren) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
