import { Linking, Pressable, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { themeColors } from "@/config/design-tokens";
import { useCompany } from "@/hooks/use-company";

type WhatsAppFabProps = {
  message: string;
  bottomOffset?: number;
};

export function WhatsAppFab({ message, bottomOffset = 24 }: WhatsAppFabProps) {
  const { data: company } = useCompany();
  const phone = company?.phone;

  if (!phone) return null;

  const phoneDigitsOnly = phone.replace(/\D/g, "");

  const handlePress = () => {
    const url = `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", right: 20, bottom: bottomOffset, zIndex: 20 }}
    >
      <Pressable
        accessibilityLabel="Chat on WhatsApp"
        accessibilityRole="button"
        className="h-14 w-14 items-center justify-center rounded-full active:opacity-85"
        onPress={handlePress}
        style={{
          backgroundColor: themeColors.whatsapp,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        <FontAwesome color="#FFFFFF" name="whatsapp" size={28} />
      </Pressable>
    </View>
  );
}
