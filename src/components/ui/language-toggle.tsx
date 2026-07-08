import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/i18n/i18n-provider";
import { AppText } from "./app-text";

type LanguageToggleProps = {
  variant?: "light" | "dark";
};

export function LanguageToggle({ variant = "light" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const isDark = variant === "dark";
  const nextLabel = language === "en" ? "العربية" : "English";

  return (
    <Pressable
      accessibilityRole="button"
      className={`absolute right-4 z-10 flex-row items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm shadow-black/20 ${
        isDark ? "border-white/20 bg-white/10" : "border-border bg-card"
      }`}
      onPress={() => setLanguage(language === "en" ? "ar" : "en")}
      style={{ top: insets.top + 12 }}
    >
      <Feather color={isDark ? "#CBD5E1" : "#64748B"} name="globe" size={14} />
      <AppText
        className="text-xs"
        style={{ color: isDark ? "#CBD5E1" : undefined }}
        muted={!isDark}
      >
        {nextLabel}
      </AppText>
    </Pressable>
  );
}
