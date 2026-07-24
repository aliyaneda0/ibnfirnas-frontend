import { useState } from "react";
import { Alert, Image, Linking, Modal, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useCompany } from "@/hooks/use-company";
import { useLanguage } from "@/i18n/i18n-provider";
import { AppText } from "./app-text";
import { BrandLogo } from "./brand-logo";

type MenuAction =
  | { type: "route"; href: "/(tabs)/Profile" | "/(auth)/login" | "/inquiry" | "/inquiries" }
  | { type: "language" }
  | { type: "call" }
  | { type: "about" };

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  labelKey: "menu.myProfile" | "menu.language" | "menu.myInquiries" | "menu.contactSupport" | "menu.aboutUs";
  action: MenuAction;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: "user", labelKey: "menu.myProfile", action: { type: "route", href: "/(tabs)/Profile" } },
  { icon: "globe", labelKey: "menu.language", action: { type: "language" } },
  { icon: "help-circle", labelKey: "menu.myInquiries", action: { type: "route", href: "/inquiries" } },
  { icon: "phone", labelKey: "menu.contactSupport", action: { type: "call" } },
  { icon: "info", labelKey: "menu.aboutUs", action: { type: "about" } },
];

export function AppHeader() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { data: company } = useCompany();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleAction = (action: MenuAction) => {
    switch (action.type) {
      case "route":
        closeMenu();
        router.push(action.href);
        return;
      case "language":
        setLanguage(language === "en" ? "ar" : "en");
        return;
      case "call":
        closeMenu();
        if (company?.phone) Linking.openURL(`tel:${company.phone}`);
        return;
      case "about":
        closeMenu();
        if (company) Alert.alert(company.name, company.description);
        return;
    }
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      <View
        className="mx-4 mt-5 flex-row items-center justify-between rounded-3xl px-4 py-3"
        style={{
          backgroundColor: "#ffffff",
          shadowColor: themeColors.navy,
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <View className="flex-row items-center gap-2.5">
          <BrandLogo card={false} size={36} />
          <View>
            <AppText
              style={{
                color: themeColors.navy,
                fontFamily: themeFontFamily.display[0],
                fontSize: 19,
                letterSpacing: 0.3,
                lineHeight:22,
              }}
            >
              IBN FIRNAS
            </AppText>
            <AppText
              numberOfLines={1}
              style={{
                color: themeColors.navy,
                fontFamily: themeFontFamily.display[0],
                fontSize: 8,
                letterSpacing: 0,
                lineHeight: 10,
                marginTop: 0,
                opacity: 0.85,
              }}
            >
              {t("home.tagline").toUpperCase()}
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityLabel={t("menu.myProfile")}
          accessibilityRole="button"
          className="h-12 w-10 items-center justify-center overflow-hidden rounded-0 active:opacity-80"
          onPress={() => setIsMenuOpen(true)}
        >
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={{ height: 36, width: 36 }} />
          ) : (
            <Feather color={themeColors.navy} name="user" size={17} />
          )}
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={closeMenu}
        transparent
        visible={isMenuOpen}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={closeMenu}
          style={{ backgroundColor: "rgba(11,31,58,0.4)" }}
        >
          <Pressable
            className="gap-4 rounded-t-3xl bg-background p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:opacity-80"
              onPress={() =>
                handleAction(
                  user
                    ? { type: "route", href: "/(tabs)/Profile" }
                    : { type: "route", href: "/(auth)/login" },
                )
              }
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: themeColors.primary }}
              >
                {user?.fullName ? (
                  <AppText style={{ color: "#FFFFFF" }} variant="subtitle">
                    {user.fullName.charAt(0).toUpperCase()}
                  </AppText>
                ) : (
                  <Feather color="#FFFFFF" name="user" size={18} />
                )}
              </View>
              <View className="flex-1">
                <AppText variant="subtitle">{user ? user.fullName : t("auth.login")}</AppText>
                <AppText className="text-xs" muted>
                  {user ? user.email : t("profile.loggedOutSubtitle")}
                </AppText>
              </View>
              <Feather color={themeColors.textSecondary} name="chevron-right" size={18} />
            </Pressable>

            <View className="overflow-hidden rounded-2xl border border-border bg-card">
              {MENU_ITEMS.map((item, index) => (
                <Pressable
                  accessibilityRole="button"
                  className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                  key={item.labelKey}
                  onPress={() => handleAction(item.action)}
                >
                  <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${themeColors.primary}1A` }}
                  >
                    <Feather color={themeColors.primary} name={item.icon} size={16} />
                  </View>
                  <AppText className="flex-1">{t(item.labelKey)}</AppText>
                  {item.action.type === "language" ? (
                    <AppText className="text-sm" muted>
                      {language === "en" ? "English" : "العربية"}
                    </AppText>
                  ) : (
                    <Feather color={themeColors.textSecondary} name="chevron-right" size={16} />
                  )}
                </Pressable>
              ))}
            </View>

            {user ? (
              <Pressable
                accessibilityRole="button"
                className="items-center rounded-2xl p-4 active:opacity-80"
                onPress={handleLogout}
                style={{ backgroundColor: `${themeColors.error}14` }}
              >
                <AppText style={{ color: themeColors.error }} variant="subtitle">
                  {t("auth.logout")}
                </AppText>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
