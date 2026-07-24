import { useEffect, useRef } from "react";
import { Animated, View, type ViewStyle } from "react-native";

import { themeColors } from "@/config/design-tokens";

type SkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ height = 16, width = "100%", borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { height, width, borderRadius, backgroundColor: themeColors.border, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton borderRadius={12} height={140} />
      <Skeleton height={16} width="70%" />
      <Skeleton height={14} width="40%" />
    </View>
  );
}
