import { Dimensions, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-view";
import { useGallery } from "@/hooks/use-gallery";
import { useLanguage } from "@/i18n/i18n-provider";
import type { GalleryItem } from "@/types/api";

const NUM_COLUMNS = 2;
const GAP = 12;
const screenWidth = Dimensions.get("window").width;
const tileSize = (screenWidth - 48 - GAP) / NUM_COLUMNS;

function GalleryTile({ item }: { item: GalleryItem }) {
  return (
    <Pressable
      className="overflow-hidden rounded-2xl active:opacity-80"
      onPress={() => router.push({ pathname: "/gallery/[id]", params: { id: String(item.id) } })}
      style={{ height: tileSize, width: tileSize }}
    >
      <Image
        contentFit="cover"
        source={{ uri: item.thumbnailUrl ?? item.mediaUrl }}
        style={{ height: "100%", width: "100%" }}
      />
    </Pressable>
  );
}

export default function GalleryScreen() {
  const { t } = useLanguage();
  const { data: items, isLoading, error, refetch } = useGallery();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: 24, paddingBottom: 180 }}
        data={isLoading ? [] : (items ?? [])}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-3">
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : error ? (
            <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
          ) : (
            <EmptyState icon="image" message={t("gallery.empty")} />
          )
        }
        ListHeaderComponent={
          <AppText className="mb-1" variant="title">
            {t("gallery.title")}
          </AppText>
        }
        numColumns={NUM_COLUMNS}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => <GalleryTile item={item} />}
      />
    </SafeAreaView>
  );
}
