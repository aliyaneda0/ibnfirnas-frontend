import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/(tabs)/Home");
    } catch (error) {
      Alert.alert(t("auth.loginTitle"), (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.primary }}>
      <LanguageToggle variant="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-36">
          <View className="items-center gap-2">
            <View className="mb-2">
              <BrandLogo size={92} />
            </View>
            <AppText className="text-3xl pt-2" style={{ color: "#FFFFFF" }} variant="title">
              {t("auth.loginTitle")}
            </AppText>
            <AppText className="px-4 text-center text-sm" style={{ color: "#CBD5E1" }}>
              {t("auth.loginSubtitle")}
            </AppText>
          </View>

          <View className="mt-8 gap-4">
            <TextField
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon="mail"
              onChangeText={setEmail}
              placeholder={t("auth.email")}
              value={email}
              variant="dark"
            />
            <TextField
              leftIcon="lock"
              onChangeText={setPassword}
              onRightIconPress={() => setSecureText(!secureText)}
              placeholder={t("auth.password")}
              rightIcon={secureText ? "eye-off" : "eye"}
              secureTextEntry={secureText}
              value={password}
              variant="dark"
            />
            <AppText
              className="self-end text-sm underline"
              onPress={() => router.push("/(auth)/forgot-password")}
              style={{ color: "#CBD5E1" }}
            >
              {t("auth.forgotPassword")}
            </AppText>
          </View>

          <View className="mt-6 gap-6">
            <PrimaryButton
              disabled={isSubmitting}
              label={t("auth.continue")}
              onPress={handleLogin}
              variant="inverse"
            />

            <View className="flex-row items-center justify-center gap-1">
              <AppText className="text-sm" style={{ color: "#CBD5E1" }}>
                {t("auth.newUser")}
              </AppText>
              <AppText
                className="text-sm underline"
                onPress={() => router.push("/(auth)/signup")}
                style={{ color: themeColors.sky }}
              >
                {t("auth.signup")}
              </AppText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
