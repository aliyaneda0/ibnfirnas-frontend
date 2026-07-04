import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Screen } from "@/components/ui/screen";
import { useLanguage } from "@/i18n/i18n-provider";
import { Link } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  const { t } = useLanguage();

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <AppText variant="title">{t("home.title")}</AppText>
        <AppText muted>{t("home.subtitle")}</AppText>
      </View>
      <Link href="/auth/language" asChild>
        <PrimaryButton label={t("language.change")} />
      </Link>
    </Screen>
  );
}
