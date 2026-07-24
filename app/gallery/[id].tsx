import { useState } from "react";
import { Dimensions, FlatList, Pressable, View, type ViewToken } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { AppText } from "@/components/ui/app-text";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { Skeleton } from "@/components/ui/skeleton";
import { useGallery } from "@/hooks/use-gallery";
import { useLanguage } from "@/i18n/i18n-provider";
import type { GalleryItem } from "@/types/api";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function ZoomableImage({ item }: { item: GalleryItem }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 4);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (savedScale.value <= 1) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const next = savedScale.value > 1 ? 1 : 2.5;
      scale.value = next;
      savedScale.value = next;
      translateX.value = 0;
      translateY.value = 0;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  const composed = Gesture.Simultaneous(Gesture.Race(doubleTapGesture, panGesture), pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          { width: screenWidth, height: screenHeight, alignItems: "center", justifyContent: "center" },
          animatedStyle,
        ]}
      >
        <Image
          accessibilityLabel={item.altText ?? item.title}
          contentFit="contain"
          source={{ uri: item.mediaUrl }}
          style={{ width: screenWidth, height: screenHeight * 0.8 }}
        />
      </Animated.View>
    </GestureDetector>
  );
}

export default function GalleryViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { data: items, isLoading, error, refetch } = useGallery();
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const initialIndex = Math.max(0, (items ?? []).findIndex((i) => String(i.id) === id));

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as GalleryItem | undefined;
    if (first) setActiveItem(first);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#000000" }}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <Skeleton height={280} width="100%" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
        </View>
      ) : !items || items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <EmptyState icon="image" message={t("gallery.empty")} />
        </View>
      ) : (
        <FlatList
          data={items}
          getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
          horizontal
          initialScrollIndex={initialIndex}
          keyExtractor={(item) => String(item.id)}
          onViewableItemsChanged={onViewableItemsChanged}
          pagingEnabled
          renderItem={({ item }) => <ZoomableImage item={item} />}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View className="absolute left-4 right-4 top-14 flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
          onPress={() => router.back()}
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Feather color="#FFFFFF" name="x" size={22} />
        </Pressable>
        {activeItem ? (
          <AppText className="max-w-[70%] text-right" style={{ color: "#FFFFFF" }} variant="subtitle">
            {activeItem.title}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}
