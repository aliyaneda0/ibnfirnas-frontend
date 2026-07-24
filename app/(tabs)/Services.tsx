import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-view";
import { useServices } from "@/hooks/use-services";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Service } from "@/types/api";

function ServiceCard({ service }: { service: Service }) {
  const { t } = useLanguage();
  return (
    <Pressable
      className="flex-row gap-3 rounded-2xl border border-border bg-card p-3 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push({ pathname: "/services/[id]", params: { id: String(service.id) } })}
    >
      {service.imageUrl ? (
        <Image
          contentFit="cover"
          source={{ uri: service.imageUrl }}
          style={{ height: 88, width: 88, borderRadius: 14 }}
        />
      ) : null}
      <View className="flex-1 gap-1">
        {service.isFeatured ? <Badge label={t("products.featured")} /> : null}
        <AppText numberOfLines={2} variant="subtitle">
          {service.name}
        </AppText>
        <AppText className="text-sm" muted numberOfLines={2}>
          {service.shortDescription}
        </AppText>
      </View>
    </Pressable>
  );
}

export default function ServicesScreen() {
  const { t } = useLanguage();
  const { data: services, isLoading, error, refetch } = useServices();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        contentContainerStyle={{ gap: 12, padding: 24, paddingBottom: 180 }}
        data={isLoading ? [] : (services ?? [])}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : error ? (
            <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
          ) : (
            <EmptyState icon="tool" message={t("services.empty")} />
          )
        }
        ListHeaderComponent={
          <AppText className="mb-4" variant="title">
            {t("services.title")}
          </AppText>
        }
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading} />}
        renderItem={({ item }) => <ServiceCard service={item} />}
      />
    </SafeAreaView>
  );
}
