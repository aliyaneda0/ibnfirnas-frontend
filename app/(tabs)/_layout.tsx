import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";

import { themeColors } from "@/config/design-tokens";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: "home", inactive: "home-outline" },
  Gallery: { active: "images", inactive: "images-outline" },
  Product: { active: "cube", inactive: "cube-outline" },
  Services: { active: "construct", inactive: "construct-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

const BAR_TINT = "#39ADAE";

function CustomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  // `href: null` screens (Profile) get `tabBarItemStyle: { display: 'none' }`
  // from expo-router — skip them here too so the bar only shows real tabs.
  const visibleRoutes = state.routes.filter(
    (route) => descriptors[route.key].options.tabBarItemStyle?.display !== "none",
  );

  return (
    <View
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        bottom: insets.bottom + 12,
        height: 64,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
        overflow: "hidden",
        backgroundColor: BAR_TINT,
        elevation: 12,
        shadowColor: themeColors.navy,
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 28 }}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index].key === route.key;
          const icons = TAB_ICONS[route.name];
          const iconName = isFocused ? icons.active : icons.inactive;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              accessibilityLabel={options.title ?? route.name}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              hitSlop={8}
              key={route.key}
              onPress={onPress}
              style={{
                height: 40,
                width: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: isFocused ? "rgba(255,255,255,0.35)" : "transparent",
              }}
            >
              <Ionicons color={isFocused ? themeColors.navy : "rgba(11,31,58,0.55)"} name={iconName} size={22} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="Product" options={{ title: "Products" }} />
      <Tabs.Screen name="Services" options={{ title: "Services" }} />
      <Tabs.Screen name="Gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="Profile" options={{ href: null, title: "Profile" }} />
    </Tabs>
  );
}
