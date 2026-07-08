import { themeFontFamily } from "@/config/design-tokens";
import { AppText } from "./app-text";

type BrandWordmarkProps = {
  className?: string;
  variant?: "light" | "dark";
};

// Standard "Ibn Firnas" wordmark style, reused anywhere the brand name appears as text.
export function BrandWordmark({ className = "", variant = "light" }: BrandWordmarkProps) {
  const isDark = variant === "dark";

  return (
    <AppText
      className={`text-2xl tracking-wide ${className}`}
      style={[
        { fontFamily: themeFontFamily.bold[0] },
        isDark ? { color: "#FFFFFF" } : undefined,
      ]}
    >
      Ibn Firnas
    </AppText>
  );
}
