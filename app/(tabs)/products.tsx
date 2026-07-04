import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ProductsScreen() {
  const { t } = useLanguage();

  return (
    <Screen>
      <AppText variant="title">{t("products.title")}</AppText>
      <AppText muted>{t("products.empty")}</AppText>
    </Screen>
  );
}
