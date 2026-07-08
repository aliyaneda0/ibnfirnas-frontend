import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: "home", inactive: "home-outline" },
  Gallery: { active: "images", inactive: "images-outline" },
  Product: { active: "cube", inactive: "cube-outline" },
  Services: { active: "construct", inactive: "construct-outline" },
};

export default function TabsLayout() {
  const { token } = useAuth();

  if (!token) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.subText,
        tabBarLabelStyle: {
          fontFamily: themeFontFamily.medium[0],
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="Gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="Product" options={{ title: "Products" }} />
      <Tabs.Screen name="Services" options={{ title: "Services" }} />
    </Tabs>
  );
}
