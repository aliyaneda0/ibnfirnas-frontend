import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ResetPasswordScreen() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  // No real email deep-link yet — accept the reset token as a route param.
  const { token: tokenParam } = useLocalSearchParams<{ token?: string }>();

  const [token, setToken] = useState(tokenParam ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert(t("auth.resetPasswordTitle"), t("auth.resetPasswordSuccess"), [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error) {
      Alert.alert(t("auth.resetPasswordTitle"), (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-16">
          <View className="items-center gap-2">
            <AppText variant="title">{t("auth.resetPasswordTitle")}</AppText>
            <AppText className="px-4 text-center text-sm" muted>
              {t("auth.resetPasswordSubtitle")}
            </AppText>
          </View>

          <View className="mt-8 gap-4">
            <TextField
              autoCapitalize="none"
              leftIcon="key"
              onChangeText={setToken}
              placeholder={t("auth.resetToken")}
              value={token}
            />
            <TextField
              leftIcon="lock"
              onChangeText={setNewPassword}
              onRightIconPress={() => setSecureText(!secureText)}
              placeholder={t("auth.newPassword")}
              rightIcon={secureText ? "eye-off" : "eye"}
              secureTextEntry={secureText}
              value={newPassword}
            />
          </View>

          <View className="mt-6">
            <PrimaryButton
              disabled={isSubmitting}
              label={t("auth.resetPasswordSubmit")}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
