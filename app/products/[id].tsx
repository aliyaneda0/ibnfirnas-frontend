import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useLocalSearchParams } from "expo-router";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <AppText variant="title">Product Details</AppText>
      <AppText muted selectable>
        Product ID: {id}
      </AppText>
    </Screen>
  );
}
