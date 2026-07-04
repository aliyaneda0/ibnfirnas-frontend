import { colors } from "@/theme/colors";
import { PropsWithChildren } from "react";
import { ScrollView } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        gap: 20,
        padding: 20,
      }}
    >
      {children}
    </ScrollView>
  );
}
