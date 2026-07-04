import { colors } from "@/theme/colors";
import { Text, TextProps } from "react-native";

type AppTextProps = TextProps & {
  muted?: boolean;
  variant?: "body" | "title";
};

export function AppText({
  muted,
  style,
  variant = "body",
  ...props
}: AppTextProps) {
  return (
    <Text
      selectable
      style={[
        {
          color: muted ? colors.textMuted : colors.text,
          fontSize: variant === "title" ? 28 : 16,
          fontWeight: variant === "title" ? "700" : "400",
          lineHeight: variant === "title" ? 34 : 22,
        },
        style,
      ]}
      {...props}
    />
  );
}
