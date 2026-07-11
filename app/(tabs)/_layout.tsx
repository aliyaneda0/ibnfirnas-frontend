import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { themeColors, themeFontFamily } from "@/config/design-tokens";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: "home", inactive: "home-outline" },
  Gallery: { active: "images", inactive: "images-outline" },
  Product: { active: "cube", inactive: "cube-outline" },
  Services: { active: "construct", inactive: "construct-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: themeFontFamily.medium[0],
          fontSize: 11,
        },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: insets.bottom + 12,
          height: 64,
          borderRadius: 28,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.4)",
          overflow: "hidden",
          backgroundColor: Platform.OS === "web" ? themeColors.card : "transparent",
          elevation: 12,
          shadowColor: themeColors.navy,
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
        },
        tabBarBackground: () =>
          Platform.OS === "web" ? null : (
            <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.92)" }}>
              <BlurView intensity={55} style={{ flex: 1 }} tint="light" />
            </View>
          ),
        tabBarItemStyle: {
          height: 64,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return (
            <View
              className="items-center justify-center rounded-full"
              style={{
                height: 40,
                width: 48,
                backgroundColor: focused ? `${themeColors.primary}1F` : "transparent",
              }}
            >
              <Ionicons color={color} name={iconName} size={22} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="Product" options={{ title: "Products" }} />
      <Tabs.Screen name="Services" options={{ title: "Services" }} />
      <Tabs.Screen name="Gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="Profile" options={{ href: null, title: "Profile" }} />
    </Tabs>
  );
}
