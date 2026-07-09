import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { themeColors } from "@/config/design-tokens";
import { useProduct } from "@/hooks/use-products";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { data: product, isLoading, error, refetch } = useProduct(id);

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
        <AppText variant="title">{t("products.detailTitle")}</AppText>
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
        ) : !product ? (
          <EmptyState icon="box" message={t("products.notFound")} />
        ) : (
          <>
            <Image
              contentFit="cover"
              source={{ uri: product.primaryImageUrl }}
              style={{ height: 220, width: "100%", borderRadius: 20 }}
            />

            {product.isFeatured ? <Badge label={t("products.featured")} /> : null}

            <AppText variant="title">{product.name}</AppText>

            <View className="flex-row items-center gap-3">
              <AppText style={{ color: themeColors.primary }} variant="title">
                {(product.discountPrice ?? product.price).toFixed(2)}
              </AppText>
              {product.discountPrice ? (
                <AppText className="text-base line-through" muted>
                  {product.price.toFixed(2)}
                </AppText>
              ) : null}
            </View>

            <AppText
              style={{
                color:
                  product.stockStatus === "IN_STOCK"
                    ? themeColors.success
                    : product.stockStatus === "LOW_STOCK"
                      ? themeColors.accent
                      : themeColors.error,
              }}
            >
              {t(
                product.stockStatus === "IN_STOCK"
                  ? "products.inStock"
                  : product.stockStatus === "LOW_STOCK"
                    ? "products.lowStock"
                    : "products.outOfStock",
              )}
            </AppText>

            <AppText muted>{product.description}</AppText>

            <PrimaryButton
              label={t("products.inquire")}
              onPress={() =>
                router.push({
                  pathname: "/inquiry",
                  params: { subject: `Product inquiry: ${product.name}` },
                })
              }
            />
          </>
        )}
      </ScrollView>

      {product ? <WhatsAppFab message={`Hi, I'm interested in ${product.name}.`} /> : null}
    </SafeAreaView>
  );
}
