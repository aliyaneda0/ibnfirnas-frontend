import { TextInput, View, type TextInputProps } from "react-native";

import { themeColors } from "@/config/design-tokens";
import { AppText } from "./app-text";

type TextFieldProps = TextInputProps & {
  className?: string;
  label: string;
};

export function TextField({ className = "", label, ...props }: TextFieldProps) {
  return (
    <View className="gap-2">
      <AppText className="text-sm font-medium" muted>
        {label}
      </AppText>
      <TextInput
        className={`min-h-14 rounded-lg border border-border bg-card px-4 font-sans text-base text-text ${className}`}
        placeholderTextColor={themeColors.subText}
        {...props}
      />
    </View>
  );
}
