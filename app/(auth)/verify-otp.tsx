import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

export default function VerifyOtpScreen() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{
    name: string;
    email: string;
    phone: string;
    password: string;
  }>();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (code.trim().length !== 4) {
      Alert.alert(t("auth.otpTitle"), "Enter the 4-digit code");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: params.name,
        email: params.email,
        phone: params.phone,
        password: params.password,
      });
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(t("auth.otpTitle"), (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    Alert.alert(t("auth.otpTitle"), t("auth.otpResend"));
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.background }}>
      <LanguageToggle variant="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-16">
          <View className="items-center gap-2">
            <AppText variant="title">{t("auth.otpTitle")}</AppText>
            <AppText className="px-4 text-center text-sm" muted>
              {t("auth.otpSubtitle")}
            </AppText>
            {params.phone ? (
              <AppText className="text-sm" variant="subtitle">
                {params.phone}
              </AppText>
            ) : null}
          </View>

          <View className="mt-8 gap-4">
            <TextField
              className="text-center text-xl tracking-[8px]"
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={setCode}
              placeholder="••••"
              value={code}
            />
          </View>

          <View className="mt-6 gap-6">
            <PrimaryButton
              disabled={isSubmitting}
              label={t("auth.otpVerify")}
              onPress={handleVerify}
            />

            <View className="items-center">
              <AppText
                className="text-sm underline"
                onPress={handleResend}
                style={{ color: themeColors.accent }}
              >
                {t("auth.otpResend")}
              </AppText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
