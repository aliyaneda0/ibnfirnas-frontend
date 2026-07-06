import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, type ScrollViewProps } from "react-native";

type ScreenProps = ScrollViewProps & {
  className?: string;
};

export function Screen({ className = "", contentContainerStyle, ...props }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className={`flex-1 ${className}`}
        contentContainerStyle={[
          {
            flexGrow: 1,
            gap: 20,
            padding: 24,
          },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        {...props}
      />
    </SafeAreaView>
  );
}
