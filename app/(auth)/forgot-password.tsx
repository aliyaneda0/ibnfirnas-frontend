import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

export default function ForgotPasswordScreen() {
  const { t } = useLanguage();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert(t("auth.forgotPasswordTitle"), t("auth.email"));
      return;
    }
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-16">
          <View className="items-center gap-2">
            <View
              className="mb-2 h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${themeColors.primary}1A` }}
            >
              <Feather color={themeColors.primary} name={isSent ? "check-circle" : "key"} size={28} />
            </View>
            <AppText variant="title">{t("auth.forgotPasswordTitle")}</AppText>
            <AppText className="px-4 text-center text-sm" muted>
              {isSent ? t("auth.forgotPasswordSent") : t("auth.forgotPasswordSubtitle")}
            </AppText>
          </View>

          {!isSent ? (
            <>
              <View className="mt-8 gap-4">
                <TextField
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leftIcon="mail"
                  onChangeText={setEmail}
                  placeholder={t("auth.email")}
                  value={email}
                />
              </View>

              <View className="mt-6">
                <PrimaryButton
                  disabled={isSubmitting}
                  label={t("auth.forgotPasswordSubmit")}
                  onPress={handleSubmit}
                />
              </View>
            </>
          ) : (
            <View className="mt-8">
              <PrimaryButton
                label={t("auth.backToLogin")}
                onPress={() => router.replace("/(auth)/login")}
              />
            </View>
          )}

          <View className="mt-6 items-center">
            <AppText
              className="text-sm underline"
              onPress={() => router.back()}
              style={{ color: themeColors.primary }}
            >
              {t("auth.backToLogin")}
            </AppText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
