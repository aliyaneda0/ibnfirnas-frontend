import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-view";
import { themeColors } from "@/config/design-tokens";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Product } from "@/types/api";

const STOCK_LABEL_KEY: Record<Product["stockStatus"], "products.inStock" | "products.lowStock" | "products.outOfStock"> = {
  IN_STOCK: "products.inStock",
  LOW_STOCK: "products.lowStock",
  OUT_OF_STOCK: "products.outOfStock",
};

const STOCK_COLOR: Record<Product["stockStatus"], string> = {
  IN_STOCK: themeColors.success,
  LOW_STOCK: themeColors.accent,
  OUT_OF_STOCK: themeColors.error,
};

function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <Pressable
      className="flex-row gap-3 rounded-2xl border border-border bg-card p-3 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push(`/products/${product.id}`)}
    >
      <Image
        contentFit="cover"
        source={{ uri: product.primaryImageUrl }}
        style={{ height: 88, width: 88, borderRadius: 14 }}
      />
      <View className="flex-1 gap-1">
        {product.isFeatured ? <Badge label={t("products.featured")} /> : null}
        <AppText numberOfLines={2} variant="subtitle">
          {product.name}
        </AppText>
        <View className="flex-row items-center gap-2">
          <AppText style={{ color: themeColors.primary }} variant="subtitle">
            {(product.discountPrice ?? product.price).toFixed(2)}
          </AppText>
          {product.discountPrice ? (
            <AppText className="text-xs line-through" muted>
              {product.price.toFixed(2)}
            </AppText>
          ) : null}
        </View>
        <AppText className="text-xs" style={{ color: STOCK_COLOR[product.stockStatus] }}>
          {t(STOCK_LABEL_KEY[product.stockStatus])}
        </AppText>
      </View>
    </Pressable>
  );
}

export default function ProductsScreen() {
  const { t } = useLanguage();
  const { data: products, isLoading, error, refetch } = useProducts();
  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategoryId === null) return products;
    return products.filter((p) => p.categoryId === activeCategoryId);
  }, [products, activeCategoryId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        contentContainerStyle={{ gap: 12, padding: 24, paddingBottom: 180 }}
        data={isLoading ? [] : filteredProducts}
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
            <EmptyState icon="box" message={t("products.empty")} />
          )
        }
        ListHeaderComponent={
          <View className="mb-4 gap-4">
            <AppText variant="title">{t("products.title")}</AppText>
            <FlatList
              contentContainerStyle={{ gap: 8 }}
              data={categories ?? []}
              horizontal
              keyExtractor={(item) => String(item.id)}
              ListHeaderComponent={
                <Pressable
                  className="mr-2 rounded-full border px-4 py-2"
                  onPress={() => setActiveCategoryId(null)}
                  style={{
                    backgroundColor: activeCategoryId === null ? themeColors.primary : themeColors.card,
                    borderColor: activeCategoryId === null ? themeColors.primary : themeColors.border,
                  }}
                >
                  <AppText style={{ color: activeCategoryId === null ? themeColors.card : themeColors.text }}>
                    {t("products.filterAll")}
                  </AppText>
                </Pressable>
              }
              renderItem={({ item }) => (
                <Pressable
                  className="mr-2 rounded-full border px-4 py-2"
                  onPress={() => setActiveCategoryId(item.id)}
                  style={{
                    backgroundColor: activeCategoryId === item.id ? themeColors.primary : themeColors.card,
                    borderColor: activeCategoryId === item.id ? themeColors.primary : themeColors.border,
                  }}
                >
                  <AppText style={{ color: activeCategoryId === item.id ? themeColors.card : themeColors.text }}>
                    {item.name}
                  </AppText>
                </Pressable>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }
        refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading} />}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </SafeAreaView>
  );
}
