import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Screen } from "@/components/ui/screen";
import { useLanguage } from "@/i18n/i18n-provider";
import { router } from "expo-router";
import { View } from "react-native";

export default function LanguageScreen() {
  const { setLanguage, t } = useLanguage();

  const chooseLanguage = (language: "en" | "ar") => {
    setLanguage(language);
    router.replace("/login");
  };

  return (
    <Screen>
      <View style={{ gap: 12 }}>
        <AppText variant="title">{t("language.title")}</AppText>
        <AppText muted>{t("language.subtitle")}</AppText>
      </View>
      <PrimaryButton label="English" onPress={() => chooseLanguage("en")} />
      <PrimaryButton label="العربية" onPress={() => chooseLanguage("ar")} />
    </Screen>
  );
}
