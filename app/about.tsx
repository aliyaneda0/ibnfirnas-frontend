import { Linking, Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ContactList } from "@/components/ui/contact-list";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { themeColors } from "@/config/design-tokens";
import { useCompany } from "@/hooks/use-company";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Company } from "@/types/api";

type IconName = keyof typeof Feather.glyphMap;

const SOCIAL_LINKS: { key: "websiteUrl" | "facebookUrl" | "instagramUrl" | "twitterUrl"; icon: IconName }[] = [
  { key: "websiteUrl", icon: "globe" },
  { key: "facebookUrl", icon: "facebook" },
  { key: "instagramUrl", icon: "instagram" },
  { key: "twitterUrl", icon: "twitter" },
];

function InfoCard({ body, icon, title }: { body: string; icon: IconName; title: string }) {
  return (
    <View className="gap-2 rounded-2xl border border-border bg-card p-4 shadow-md shadow-black/10">
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${themeColors.primary}1A` }}>
          <Feather color={themeColors.primary} name={icon} size={15} />
        </View>
        <AppText variant="subtitle">{title}</AppText>
      </View>
      <AppText className="text-sm leading-6" muted>
        {body}
      </AppText>
    </View>
  );
}

function AboutSkeleton() {
  return (
    <View className="gap-4">
      <Skeleton borderRadius={20} height={160} />
      <View className="items-center gap-3">
        <Skeleton borderRadius={999} height={64} width={64} />
        <Skeleton height={20} width="55%" />
      </View>
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="85%" />
      <Skeleton borderRadius={16} height={90} />
      <Skeleton borderRadius={16} height={90} />
    </View>
  );
}

export default function AboutScreen() {
  const { t } = useLanguage();
  const { data: company, error, isLoading, refetch } = useCompany();

  const socialLinks = company
    ? SOCIAL_LINKS.filter((link) => company[link.key])
    : [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-6 pb-2 pt-4">
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Feather color={themeColors.text} name="chevron-left" size={24} />
        </Pressable>
        <AppText variant="title">{t("about.title")}</AppText>
      </View>

      <ScrollView contentContainerStyle={{ gap: 16, padding: 24, paddingTop: 8, paddingBottom: 48 }}>
        {isLoading ? (
          <AboutSkeleton />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
        ) : !company ? (
          <EmptyState icon="info" message={t("home.companyEmpty")} />
        ) : (
          <AboutContent company={company} socialLinks={socialLinks} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AboutContent({
  company,
  socialLinks,
}: {
  company: Company;
  socialLinks: { key: "websiteUrl" | "facebookUrl" | "instagramUrl" | "twitterUrl"; icon: IconName }[];
}) {
  const { t } = useLanguage();

  return (
    <>
      {company.bannerUrl ? (
        <Image contentFit="cover" source={{ uri: company.bannerUrl }} style={{ height: 160, width: "100%", borderRadius: 20 }} />
      ) : null}

      <View className="items-center gap-3">
        <BrandLogo size={64} />
        <AppText className="text-center" variant="title">
          {company.name}
        </AppText>
      </View>

      <AppText className="text-sm leading-6">{company.description}</AppText>

      {company.mission ? <InfoCard body={company.mission} icon="target" title={t("about.mission")} /> : null}
      {company.vision ? <InfoCard body={company.vision} icon="eye" title={t("about.vision")} /> : null}

      {company.phone || company.email || company.address ? (
        <View className="gap-3">
          <AppText className="text-sm uppercase tracking-wide" muted>
            {t("home.contactUs")}
          </AppText>
          <ContactList company={company} />
        </View>
      ) : null}

      {socialLinks.length > 0 ? (
        <View className="flex-row justify-center gap-3 pt-2">
          {socialLinks.map((link) => (
            <Pressable
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full active:opacity-75"
              key={link.key}
              onPress={() => {
                const url = company[link.key];
                if (url) Linking.openURL(url);
              }}
              style={{ backgroundColor: `${themeColors.primary}1A` }}
            >
              <Feather color={themeColors.primary} name={link.icon} size={18} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </>
  );
}
