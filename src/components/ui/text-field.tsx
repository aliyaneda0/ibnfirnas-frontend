import { AppText } from "@/components/ui/app-text";
import { colors } from "@/theme/colors";
import { TextInput, TextInputProps, View } from "react-native";

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, style, ...props }: TextFieldProps) {
  return (
    <View style={{ gap: 8 }}>
      <AppText>{label}</AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            borderColor: colors.border,
            borderRadius: 8,
            borderWidth: 1,
            color: colors.text,
            fontSize: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}
