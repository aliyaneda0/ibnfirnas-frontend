import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ServicesScreen() {
  const { t } = useLanguage();

  return (
    <Screen>
      <AppText variant="title">{t("services.title")}</AppText>
      <AppText muted>{t("services.empty")}</AppText>
    </Screen>
  );
}
