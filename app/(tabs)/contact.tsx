import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ContactScreen() {
  const { t } = useLanguage();

  return (
    <Screen>
      <AppText variant="title">{t("contact.title")}</AppText>
      <AppText muted>{t("contact.empty")}</AppText>
    </Screen>
  );
}
