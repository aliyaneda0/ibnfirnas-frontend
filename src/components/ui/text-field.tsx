import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";

import { themeColors } from "@/config/design-tokens";
import { AppText } from "./app-text";

type IconName = keyof typeof Feather.glyphMap;

type TextFieldProps = TextInputProps & {
  className?: string;
  label?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  variant?: "light" | "dark";
};

export function TextField({
  className = "",
  label,
  leftIcon,
  onRightIconPress,
  placeholderTextColor,
  rightIcon,
  variant = "light",
  ...props
}: TextFieldProps) {
  const isDark = variant === "dark";

  return (
    <View className="gap-2">
      {label ? (
        <AppText
          className={`text-sm font-medium ${isDark ? "text-white" : ""}`}
          muted={!isDark}
        >
          {label}
        </AppText>
      ) : null}
      <View
        className={`min-h-14 flex-row items-center gap-3 rounded-xl border px-4 shadow-sm shadow-black/20 ${
          isDark ? "border-white/20 bg-white/10" : "border-border bg-card"
        }`}
      >
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={20}
            color={isDark ? "#CBD5E1" : themeColors.subText}
          />
        ) : null}
        <TextInput
          className={`flex-1 font-sans text-base ${isDark ? "text-white" : "text-text"} ${className}`}
          placeholderTextColor={
            placeholderTextColor ?? (isDark ? "#94A3B8" : themeColors.subText)
          }
          {...props}
        />
        {rightIcon ? (
          <Pressable hitSlop={8} onPress={onRightIconPress}>
            <Feather
              name={rightIcon}
              size={20}
              color={isDark ? "#CBD5E1" : themeColors.subText}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
