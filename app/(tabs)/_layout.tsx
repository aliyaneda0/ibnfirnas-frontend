import * as React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: "home", inactive: "home-outline" },
  products: { active: "cube", inactive: "cube-outline" },
  services: { active: "construct", inactive: "construct-outline" },
  gallery: { active: "images", inactive: "images-outline" },
  cart: { active: "cart", inactive: "cart-outline" },
  contact: { active: "call", inactive: "call-outline" },
};

export default function TabsLayout() {

   const { token } = useAuth();
  if (!token) return <Redirect href="/(auth)/login" />;
  return <Tabs .Protected.apply.apply/>;
  
  return React.createElement(
    Tabs,
    {
      screenOptions: ({ route }) => ({
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

          return React.createElement(Ionicons, { color, name: iconName, size });
        },
      }),
    },
    React.createElement(Tabs.Screen, { name: "index", options: { title: "Home" } }),
    React.createElement(Tabs.Screen, { name: "products", options: { title: "Products" } }),
    React.createElement(Tabs.Screen, { name: "services", options: { title: "Services" } }),
    React.createElement(Tabs.Screen, { name: "gallery", options: { title: "Gallery" } }),
    React.createElement(Tabs.Screen, {
      name: "cart",
      options: {
        tabBarBadge: undefined,
        tabBarBadgeStyle: { backgroundColor: themeColors.accent },
        title: "Cart",
      },
    }),
    React.createElement(Tabs.Screen, { name: "contact", options: { title: "Contact" } })
  );
}
