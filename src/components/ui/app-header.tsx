import { useState } from "react";
import { Image, Modal, Pressable, View } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";
import { AppText } from "./app-text";

import LogoImage from "../../../assets/images/splash-icon.png";

type QuickNavItem = {
  icon: keyof typeof Feather.glyphMap;
  labelKey: "home.title" | "services.title" | "gallery.title" | "contact.title";
  href: "/(tabs)/Home" | "/(tabs)/Services" | "/(tabs)/Gallery" | "/inquiry";
};

const QUICK_NAV_ITEMS: QuickNavItem[] = [
  { icon: "home", labelKey: "home.title", href: "/(tabs)/Home" },
  { icon: "tool", labelKey: "services.title", href: "/(tabs)/Services" },
  { icon: "image", labelKey: "gallery.title", href: "/(tabs)/Gallery" },
  { icon: "mail", labelKey: "contact.title", href: "/inquiry" },
];

export function AppHeader() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <View
        className="mx-4 mt-2 flex-row items-center justify-between overflow-hidden rounded-3xl"
        style={{
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.4)",
          shadowColor: themeColors.navy,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <BlurView
          intensity={50}
          tint="light"
          style={{ position: "absolute", inset: 0 }}
        />
        <View
          style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.55)" }}
        />

        <View className="w-full flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-2.5">
            <Image resizeMode="contain" source={LogoImage} style={{ height: 38, width: 38 }} />
            <View>
              <AppText
                style={{
                  color: themeColors.primary,
                  fontFamily: themeFontFamily.bold[0],
                  fontSize: 17,
                  letterSpacing: 0.3,
                  lineHeight: 19,
                }}
              >
                IBN FIRNAS
              </AppText>
              <AppText
                style={{
                  color: themeColors.primaryLight,
                  fontFamily: themeFontFamily.medium[0],
                  fontSize: 9.5,
                  letterSpacing: 1,
                  lineHeight: 12,
                  marginTop: 1,
                }}
              >
                {t("home.tagline").toUpperCase()}
              </AppText>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityLabel={t("home.quickAccess")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full active:opacity-80"
              onPress={() => setIsMenuOpen(true)}
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            >
              <Feather color={themeColors.primary} name="grid" size={18} />
            </Pressable>
            <Pressable
              accessibilityLabel={t("profile.title")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center overflow-hidden rounded-full active:opacity-80"
              onPress={() => router.push("/(tabs)/Profile")}
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            >
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={{ height: 40, width: 40 }} />
              ) : (
                <Feather color={themeColors.primary} name="user" size={18} />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
        transparent
        visible={isMenuOpen}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setIsMenuOpen(false)}
          style={{ backgroundColor: "rgba(11,31,58,0.4)" }}
        >
          <Pressable
            className="gap-1 rounded-t-3xl bg-card p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            {QUICK_NAV_ITEMS.map((item) => (
              <Pressable
                accessibilityRole="button"
                className="flex-row items-center gap-3 rounded-xl px-2 py-3 active:opacity-70"
                key={item.href}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push(item.href);
                }}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${themeColors.primary}1A` }}
                >
                  <Feather color={themeColors.primary} name={item.icon} size={18} />
                </View>
                <AppText variant="subtitle">{t(item.labelKey)}</AppText>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
