import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { themeColors } from "@/config/design-tokens";
import { AppText } from "./app-text";

type ErrorStateProps = {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};

export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <View className="items-center gap-3 px-6 py-12">
      <Feather color={themeColors.error} name="alert-circle" size={32} />
      <AppText className="text-center" muted>
        {message}
      </AppText>
      <Pressable
        accessibilityRole="button"
        className="mt-2 rounded-xl bg-primary px-5 py-3 active:opacity-80"
        onPress={onRetry}
      >
        <AppText style={{ color: themeColors.card }}>{retryLabel}</AppText>
      </Pressable>
    </View>
  );
}

type EmptyStateProps = {
  message: string;
  icon?: keyof typeof Feather.glyphMap;
};

export function EmptyState({ message, icon = "inbox" }: EmptyStateProps) {
  return (
    <View className="items-center gap-3 px-6 py-12">
      <Feather color={themeColors.textSecondary} name={icon} size={32} />
      <AppText className="text-center" muted>
        {message}
      </AppText>
    </View>
  );
}
