import { View } from "react-native";

import { themeColors } from "@/config/design-tokens";
import { AppText } from "./app-text";

type BadgeProps = {
  label: string;
};

export function Badge({ label }: BadgeProps) {
  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: themeColors.accent }}
    >
      <AppText className="text-xs" style={{ color: themeColors.card }}>
        {label}
      </AppText>
    </View>
  );
}
