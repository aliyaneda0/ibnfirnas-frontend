import { useState } from "react";
import { Image, Pressable, View } from "react-native";
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

function humanizeRole(role: string | undefined) {
  if (!role) return "—";
  return role.replace(/^ROLE_/, "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function LoggedOutPrompt() {
  const { t } = useLanguage();
  return (
    <View className="items-center gap-4 py-10">
      <View
        className="h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColors.primary}1A` }}
      >
        <Feather color={themeColors.primary} name="user" size={34} />
      </View>
      <AppText className="text-center" variant="subtitle">
        {t("profile.loggedOutTitle")}
      </AppText>
      <AppText className="px-6 text-center text-sm" muted>
        {t("profile.loggedOutSubtitle")}
      </AppText>
      <View className="mt-2 w-full gap-3">
        <PrimaryButton label={t("auth.login")} onPress={() => router.push("/(auth)/login")} />
        <Pressable
          accessibilityRole="button"
          className="items-center py-2 active:opacity-70"
          onPress={() => router.push("/(auth)/signup")}
        >
          <AppText style={{ color: themeColors.primary }}>{t("auth.signup")}</AppText>
        </Pressable>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useLanguage();
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user?.fullName ?? "");
  const [phoneInput, setPhoneInput] = useState(user?.phone ?? "");
  const [avatarUrlInput, setAvatarUrlInput] = useState(user?.avatarUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const startEditing = () => {
    setFullNameInput(user?.fullName ?? "");
    setPhoneInput(user?.phone ?? "");
    setAvatarUrlInput(user?.avatarUrl ?? "");
    setIsEditing(true);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: fullNameInput.trim(),
        phone: phoneInput.trim() || undefined,
        avatarUrl: avatarUrlInput.trim() || undefined,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const submitPasswordChange = async () => {
    setPasswordError(null);
    setIsSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordError((error as Error).message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Screen>
      <AppText variant="title">{t("profile.title")}</AppText>

      {!user ? (
        <LoggedOutPrompt />
      ) : (
        <>
          <View className="items-center gap-3">
            <View
              className="h-24 w-24 items-center justify-center overflow-hidden rounded-full"
              style={{ backgroundColor: `${themeColors.primary}1A` }}
            >
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={{ height: 96, width: 96 }} />
              ) : (
                <Feather color={themeColors.primary} name="user" size={40} />
              )}
            </View>
            <AppText variant="subtitle">{user.fullName}</AppText>
          </View>

          {!isEditing ? (
            <View>
              <InfoRow label={t("profile.email")} value={user.email} />
              <InfoRow label={t("profile.role")} value={humanizeRole(user.role)} />
              <InfoRow label={t("profile.phone")} value={user.phone ?? "—"} />

              <Pressable
                accessibilityRole="button"
                className="mt-3 flex-row items-center gap-1 self-start active:opacity-70"
                hitSlop={8}
                onPress={startEditing}
              >
                <Feather color={themeColors.primary} name="edit-2" size={14} />
                <AppText className="text-sm" style={{ color: themeColors.primary }}>
                  {t("profile.edit")}
                </AppText>
              </Pressable>
            </View>
          ) : (
            <View className="gap-3">
              <TextField
                leftIcon="user"
                onChangeText={setFullNameInput}
                placeholder={t("profile.name")}
                value={fullNameInput}
              />
              <TextField
                keyboardType="phone-pad"
                leftIcon="phone"
                onChangeText={setPhoneInput}
                placeholder={t("profile.phone")}
                value={phoneInput}
              />
              <TextField
                autoCapitalize="none"
                leftIcon="image"
                onChangeText={setAvatarUrlInput}
                placeholder={t("profile.avatarUrl")}
                value={avatarUrlInput}
              />
              <View className="flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-70"
                  onPress={() => setIsEditing(false)}
                >
                  <AppText muted>{t("profile.cancel")}</AppText>
                </Pressable>
                <View className="flex-1">
                  <PrimaryButton disabled={isSaving} label={t("profile.save")} onPress={saveProfile} />
                </View>
              </View>
            </View>
          )}

          <View className="mt-2 border-t border-border pt-4">
            {!isChangingPassword ? (
              <Pressable
                accessibilityRole="button"
                className="flex-row items-center gap-2 active:opacity-70"
                onPress={() => setIsChangingPassword(true)}
              >
                <Feather color={themeColors.primary} name="lock" size={16} />
                <AppText style={{ color: themeColors.primary }}>{t("profile.changePassword")}</AppText>
              </Pressable>
            ) : (
              <View className="gap-3">
                <TextField
                  leftIcon="lock"
                  onChangeText={setCurrentPassword}
                  placeholder={t("profile.currentPassword")}
                  secureTextEntry
                  value={currentPassword}
                />
                <TextField
                  leftIcon="lock"
                  onChangeText={setNewPassword}
                  placeholder={t("auth.newPassword")}
                  secureTextEntry
                  value={newPassword}
                />
                {passwordError ? (
                  <AppText className="text-sm" style={{ color: themeColors.error }}>
                    {passwordError}
                  </AppText>
                ) : null}
                <View className="flex-row gap-3">
                  <Pressable
                    accessibilityRole="button"
                    className="flex-1 items-center rounded-xl border border-border py-3 active:opacity-70"
                    onPress={() => {
                      setIsChangingPassword(false);
                      setPasswordError(null);
                      setCurrentPassword("");
                      setNewPassword("");
                    }}
                  >
                    <AppText muted>{t("profile.cancel")}</AppText>
                  </Pressable>
                  <View className="flex-1">
                    <PrimaryButton
                      disabled={isSavingPassword}
                      label={t("profile.save")}
                      onPress={submitPasswordChange}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          <Pressable
            className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/10 active:opacity-80"
            onPress={handleLogout}
          >
            <Feather color={themeColors.error} name="log-out" size={18} />
            <AppText style={{ color: themeColors.error }}>{t("auth.logout")}</AppText>
          </Pressable>
        </>
      )}
    </Screen>
  );
}
