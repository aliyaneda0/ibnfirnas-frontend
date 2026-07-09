import { useState } from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Screen } from "@/components/ui/screen";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-1 border-b border-border py-3">
      <AppText className="text-sm" muted>
        {label}
      </AppText>
      <AppText variant="subtitle">{value}</AppText>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState(user?.location ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setLocationInput(user?.location ?? "");
    setIsEditingLocation(true);
  };

  const saveLocation = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ location: locationInput.trim() });
      setIsEditingLocation(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen>
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Feather color={themeColors.text} name="chevron-left" size={24} />
        </Pressable>
        <AppText variant="title">{t("profile.title")}</AppText>
      </View>

      <View className="items-center gap-3">
        <View
          className="h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: `${themeColors.primary}1A` }}
        >
          <Feather color={themeColors.primary} name="user" size={40} />
        </View>
        {user?.name ? <AppText variant="subtitle">{user.name}</AppText> : null}
      </View>

      <View>
        <InfoRow label={t("profile.name")} value={user?.name ?? "—"} />
        <InfoRow label={t("profile.phone")} value={user?.phone ?? "—"} />
        <InfoRow label={t("profile.email")} value={user?.email ?? "—"} />

        <View className="gap-1 py-3">
          <View className="flex-row items-center justify-between">
            <AppText className="text-sm" muted>
              {t("profile.location")}
            </AppText>
            {!isEditingLocation ? (
              <Pressable
                accessibilityRole="button"
                className="flex-row items-center gap-1 active:opacity-70"
                hitSlop={8}
                onPress={startEditing}
              >
                <Feather color={themeColors.primary} name="edit-2" size={14} />
                <AppText className="text-sm" style={{ color: themeColors.primary }}>
                  {t("profile.edit")}
                </AppText>
              </Pressable>
            ) : null}
          </View>

          {isEditingLocation ? (
            <View className="mt-2 gap-3">
              <TextField
                autoFocus
                leftIcon="map-pin"
                onChangeText={setLocationInput}
                placeholder={t("profile.locationPlaceholder")}
                value={locationInput}
              />
              <PrimaryButton
                disabled={isSaving}
                label={t("profile.save")}
                onPress={saveLocation}
              />
            </View>
          ) : (
            <AppText variant="subtitle">
              {user?.location || t("profile.locationEmpty")}
            </AppText>
          )}
        </View>
      </View>
    </Screen>
  );
}
