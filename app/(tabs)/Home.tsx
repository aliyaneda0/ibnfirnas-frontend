import { Pressable, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";
import HeroSlider from "../../src/components/HeroSlider";

type IconName = keyof typeof Feather.glyphMap;

const ENTRIES: {
  icon: IconName;
  href: "/(tabs)/Product" | "/(tabs)/Services" | "/(tabs)/Gallery";
  titleKey: "products.title" | "services.title" | "gallery.title";
}[] = [
  { icon: "box", href: "/(tabs)/Product", titleKey: "products.title" },
  { icon: "tool", href: "/(tabs)/Services", titleKey: "services.title" },
  { icon: "image", href: "/(tabs)/Gallery", titleKey: "gallery.title" },
];

export default function Home() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Slider */}
        <HeroSlider />

        {/* Profile Row */}
        <View className="flex-row mt-4 px-4">
          <Pressable
            accessibilityLabel={t("profile.title")}
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-card active:opacity-80"
            onPress={() => router.push("/profile")}
          >
            <Feather color={themeColors.primary} name="user" size={20} />
          </Pressable>
        </View>

        {/* Welcome Text */}
        <View className="gap-2 mt-4 px-4">
          <AppText variant="title">{t("home.title")}</AppText>
          <AppText muted>{t("home.subtitle")}</AppText>
          {user ? (
            <AppText className="mt-1 text-sm" muted>
              {user.name ?? user.phone}
            </AppText>
          ) : null}
        </View>

        {/* Menu Entries */}
        <View className="gap-3 mt-4 px-4">
          {ENTRIES.map((entry) => (
            <Pressable
              className="flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-md shadow-black/10 active:opacity-80"
              key={entry.href}
              onPress={() => router.push(entry.href)}
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${themeColors.primary}1A` }}
              >
                <Feather
                  color={themeColors.primary}
                  name={entry.icon}
                  size={20}
                />
              </View>
              <AppText className="flex-1" variant="subtitle">
                {t(entry.titleKey)}
              </AppText>
              <Feather
                color={themeColors.subText}
                name="chevron-right"
                size={20}
              />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable
          className="mt-4 mx-4 mb-8 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/10 active:opacity-80"
          onPress={logout}
        >
          <Feather color={themeColors.accent} name="log-out" size={18} />
          <AppText style={{ color: themeColors.accent }}>
            {t("auth.logout")}
          </AppText>
        </Pressable>

      </ScrollView>
    </Screen>
  );
}