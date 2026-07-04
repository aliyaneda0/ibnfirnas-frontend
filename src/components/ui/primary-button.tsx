import { colors } from "@/theme/colors";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
      })}
    >
      <Text style={{ color: colors.onPrimary, fontSize: 16, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}
