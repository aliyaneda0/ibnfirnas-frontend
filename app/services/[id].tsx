import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { themeColors } from "@/config/design-tokens";
import { useService } from "@/hooks/use-services";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { data: service, isLoading, error, refetch } = useService(id);

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
        <AppText variant="title">{t("services.detailTitle")}</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120, gap: 16 }}>
        {isLoading ? (
          <View className="gap-3">
            <Skeleton borderRadius={20} height={220} />
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} width="40%" />
          </View>
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
        ) : !service ? (
          <EmptyState icon="tool" message={t("services.notFound")} />
        ) : (
          <>
            {service.imageUrl ? (
              <Image
                contentFit="cover"
                source={{ uri: service.imageUrl }}
                style={{ height: 220, width: "100%", borderRadius: 20 }}
              />
            ) : null}

            {service.isFeatured ? <Badge label={t("products.featured")} /> : null}

            <AppText variant="title">{service.name}</AppText>
            <AppText muted>{service.description}</AppText>

            <PrimaryButton
              label={t("services.inquire")}
              onPress={() =>
                router.push({
                  pathname: "/inquiry",
                  params: { subject: `Service inquiry: ${service.name}` },
                })
              }
            />
          </>
        )}
      </ScrollView>

      {service ? <WhatsAppFab message={`Hi, I'm interested in ${service.name}.`} /> : null}
    </SafeAreaView>
  );
}
